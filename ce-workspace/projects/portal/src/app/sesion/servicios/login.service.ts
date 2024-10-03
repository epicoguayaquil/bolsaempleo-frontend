import { Injectable, inject } from '@angular/core';
import { Observable, Subject, catchError, firstValueFrom, from, map, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Usuario } from '../modelos/Usuario';
import { IDBPDatabase, openDB } from 'idb';
import { LoginDB, TipoParamSistema } from '../modelos/LoginDB';
import { RepuestaToken, Respuesta } from '../../../../../centroemprendimiento-lib/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Define aquí las rutas en las que se excluye el componente de login
  excludedRoutes: string[] = ['/registro/*'];
  app:string='';
  nameApp:string='';
  tipoRegistro:TipoRegistro = TipoRegistro.PERSONA;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private loggedInSubject = new Subject<boolean>();
  private registrarInSubject = new Subject<boolean>();
  private httpClient:HttpClient = inject(HttpClient);
  private messageService:MessageService = inject(MessageService);
  private dbPromise: Promise<IDBPDatabase<LoginDB>>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  // Método para comprobar si una ruta está excluida
  isRouteExcluded(route: string): boolean {
    return this.excludedRoutes.some(excludedRoute => {
      if (excludedRoute.endsWith('*')) {
        return route.startsWith(excludedRoute.slice(0, -1));
      }
      return route === excludedRoute;
    });
  }

  // Iniciar sesión
  loginUser(credentials: ParamLogin): Observable<boolean> {
    return this.httpClient.post<Respuesta>(`${environment.api_seguridad}login/ingresar`, credentials, this.httpOptions).pipe(
      map(data => {
        this.setUserSession(data.data);
        return true;
      }),
      catchError((response: HttpErrorResponse) => {
        const errorMessage = response.status === 400 && response.error.codigo === 2
          ? `No te encuentras registrado en el/la ${this.nameApp}`
          : response.error.mensaje;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        return of(false);
      })
    );
  }

  // Observar estado de inicio de sesión
  observeLoginStatus(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  // Observar estado de registro
  observeRegisterStatus(): Observable<boolean> {
    return this.registrarInSubject.asObservable();
  }

  // Comprobar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getParamValue('TOKEN');
      return !!token;
    } catch (error) {
      console.error('Error al comprobar autenticación:', error);
      return false;
    }
  }

  // Obtener token
  async getToken(): Promise<string | undefined> {
    try {
      const token = await this.getParamValue('TOKEN');
      return token?.value;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return undefined;
    }
  }

  // Guardar token
  async saveToken(token: string): Promise<void> {
    await this.saveOrUpdateParam({ nemonico: 'TOKEN', value: token });
  }

  // Abrir login
  openLogin(): void {
    this.loggedInSubject.next(false);
  }

  // Cerrar sesión
  logout(): void {
    ['USUARIO', 'PERFIL', 'TOKEN'].forEach(param => this.deleteParam(param));
    this.loggedInSubject.next(false);
  }

  // Establecer sesión del usuario
  setUserSession(usuario: Usuario): void {
    this.saveOrUpdateParam({ nemonico: 'USUARIO', value: usuario });
    this.loggedInSubject.next(true);
  }

  
  // Verificar token
  async verifyToken(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (token) {
        await firstValueFrom(this.httpClient.post<RepuestaToken>(
          `${environment.api_seguridad}login/verificar`, null, this.httpOptions
        ));
        return true;
      }
      return false;
    } catch (response) {
      if (response instanceof HttpErrorResponse) {
        const errorMessage = response.status === 403
          ? response.error.mensaje
          : 'Su sesión ha caducado';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        this.logout();
      }
      return false;
    }
  }

  // Obtener usuario
  async getUser(): Promise<Usuario | undefined> {
    try {
      const usuario = await this.getParamValue('USUARIO');
      return usuario?.value as Usuario;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return undefined;
    }
  }

  // Consultar parámetros de perfil
  consultarParametrosPerfil(perfil:string){
    return this.httpClient.post<Respuesta>(`${environment.api_persona}persona/perfil/${perfil}`, null, this.httpOptions).pipe(
      map(data => {
        this.saveOrUpdateParam({ nemonico: 'PERFIL', value: data.data });
        return data.data;
      }),
      catchError((response: HttpErrorResponse) => {
        const errorMessage = response.status === 400 && response.error.codigo === 2
          ? `Ha ocurrido un error inesperado ${this.nameApp}`
          : response.error.mensaje;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        return of(false);
      })
    );
  }

  // Obtener parámetros de perfil
  async getParametrosPerfil(): Promise<any>{
    try {
      const perfil = await this.getParamValue('PERFIL');
      return perfil?.value || {};
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      return {};
    }
  }

  // Registro
  register(): void {
    this.registrarInSubject.next(true);
  }

  // Inicializar base de datos
  private async initDB(): Promise<IDBPDatabase<LoginDB>> {
    return openDB<LoginDB>('login-database', 1, {
      upgrade(db) {
        db.createObjectStore('paramSystem', { keyPath: 'nemonico' });
      },
    });
  }

  // Guardar o actualizar parámetro
  private async saveOrUpdateParam(param: TipoParamSistema): Promise<void> {
    const db = await this.dbPromise;
    await db.put('paramSystem', param);
  }

  // Obtener valor del parámetro
  private async getParamValue(nemonico: string): Promise<TipoParamSistema | undefined> {
    const db = await this.dbPromise;
    return db.get('paramSystem', nemonico);
  }

  // Eliminar parámetro
  private async deleteParam(nemonico: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('paramSystem', nemonico);
  }
}


export interface ParamLogin{
  usuario: string,
  password: string,
  app:string
}

export enum TipoRegistro {
  PERSONA = 'PERSONA',
  POSTULANTE = 'POSTULANTE'
}