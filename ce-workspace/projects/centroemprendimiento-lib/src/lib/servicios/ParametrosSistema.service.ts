import { Injectable, inject } from '@angular/core';
import { CatalogoService } from './Catalogo.service';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { ConfigService } from './ConfigService.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrosSistemaService {

  private parametros: { [key: string]: ParametroSistema } = {};
  private parametroSubjects: { [key: string]: BehaviorSubject<ParametroSistema | null> } = {};
  private catalogoService: CatalogoService = inject(CatalogoService);
  private configService:ConfigService = inject(ConfigService);

  clearParams(){
    this.parametros = {};
    this.parametroSubjects = {};
  }

  cargaParametrosEspecificos(params: Array<string>){
    this.catalogoService.get('PARAMETRO', {'nombres_parametros': params}).subscribe(data => {
      if (data.codigo == '1') {
        data.data.forEach(element => {
          this.parametros[element.nombre] = element;
          this.getParametroSubject(element.nombre).next(element);
        });
      }
    });
  }

  cargarParametrosDefault(){
    this.catalogoService.get('PARAMETRO_SISTEMA', {'nameParam': this.configService.environment.nombre_url_archivo}).subscribe(data => {
      if (data.data) {
        this.parametros[data.data[0].nombre] = data.data[0];
        this.getParametroSubject(data.data[0].nombre).next(data.data[0]);
      }
    });
  }

  getRutaArchivo(): Observable<string> {
    return this.getParametro(this.configService.environment.nombre_url_archivo).pipe(
      map(parametro => parametro ? parametro.valor : '')
    );
  }

  getParametro(nombre: string): Observable<ParametroSistema | null> {
    return this.getParametroSubject(nombre).asObservable();
  }

  private getParametroSubject(nombre: string): BehaviorSubject<ParametroSistema | null> {
    if (!this.parametroSubjects[nombre]) {
      this.parametroSubjects[nombre] = new BehaviorSubject<ParametroSistema | null>(null);
    }
    return this.parametroSubjects[nombre];
  }
}

export interface ParametroSistema {
  id: string | number;
  nombre: string;
  valor: string;
  valor_json: string;
  valor_html: string;
}