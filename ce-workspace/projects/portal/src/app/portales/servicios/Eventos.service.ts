import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { General, Respuesta, RespuestaPaginacion } from '../../../../../centroemprendimiento-lib/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private httpClient = inject(HttpClient);

  eventos(rows?:number, page?:number, parametros?:any){
    let httpOptions:any = {...this.httpOptions, params:null};
    parametros.rows = rows ? rows : 5;
    parametros.page = page ? page : 1;
    httpOptions.params = General.constructHttpParams(parametros);
    return this.httpClient.get<RespuestaPaginacion>(environment.api_agenda + 'eventos/portal/search', httpOptions);
  }

  evento(id:number|string){
    let httpOptions:any = {...this.httpOptions, params: null};
    return this.httpClient.get<Respuesta>(environment.api_agenda + 'eventos/portal/search/'+id, httpOptions);
  }
  
  registrarseEvento(agenda:any){
    return this.httpClient.post<Respuesta>(environment.api_agenda+'agenda', agenda, this.httpOptions);
  }

  servicios(rows?:number, page?:number, parametros?:any){
    let httpOptions:any = {...this.httpOptions, params:null};
    parametros.rows = rows ? rows : 5;
    parametros.page = page ? page : 1;
    httpOptions.params = General.constructHttpParams(parametros);
    return this.httpClient.get<RespuestaPaginacion>(environment.api_programa + 'programas/portal/search', httpOptions);
  }

  servicio(id:number|string){
    let httpOptions:any = {...this.httpOptions, params: null};
    return this.httpClient.get<Respuesta>(environment.api_programa + 'programas/portal/search/'+id, httpOptions);
  }
}
