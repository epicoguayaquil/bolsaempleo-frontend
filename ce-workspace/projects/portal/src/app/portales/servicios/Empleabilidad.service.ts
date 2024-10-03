import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { LoginService } from '../../sesion/servicios/login.service';
import { General, Respuesta, RespuestaPaginacion } from '../../../../../centroemprendimiento-lib/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class EmpleabilidadService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private httpClient = inject(HttpClient);
  private loginService:LoginService = inject(LoginService);

  ofertaLaboral(id:number|string, params?){
    let httpOptions:any = {...this.httpOptions, params: null};
    if(params){
      httpOptions.params = General.constructHttpParams(params);
    }
    return this.httpClient.get<Respuesta>(environment.api_empleabilidad + 'empleabilidad/oferta/'+id, httpOptions);
  }

  ofertasLaborales(rows?:number, page?:number, parametros?:any){
    
    let httpOptions:any = {...this.httpOptions, params:null};
    parametros.rows = rows ? rows : 5;
    parametros.page = page ? page : 1;
    httpOptions.params = General.constructHttpParams(parametros);
    return this.httpClient.get<RespuestaPaginacion>(environment.api_empleabilidad + 'empleabilidad/ofertas_laborales', httpOptions);
  }

  postular(id){
    return this.httpClient.post<Respuesta>(environment.api_empleabilidad + 'empleabilidad/postular/' + id, null, this.httpOptions);
  }
}