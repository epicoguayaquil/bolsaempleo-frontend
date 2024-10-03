import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Respuesta } from '../../../../../centroemprendimiento-lib/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoIndicadorService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private httpClient = inject(HttpClient);

  //constructor(private httpClient: HttpClient) { }

  crearEmpresa(empresa:any){
    return this.httpClient.post<Respuesta>(environment.api_programa + 'seguimiento_indicador/empresa_aliada', empresa, this.httpOptions);
  }

  crearPrograma(programa:any){
    return this.httpClient.post<Respuesta>(environment.api_programa + 'seguimiento_indicador/programa', programa, this.httpOptions);
  }

  crearIndicador(indicador:any){
    return this.httpClient.post<Respuesta>(environment.api_programa + 'seguimiento_indicador/create', indicador, this.httpOptions);
  }

  actualizarIndicador(indicador:any, id){
    return this.httpClient.put<Respuesta>(environment.api_programa + 'seguimiento_indicador/update/'+id, indicador, this.httpOptions);
  }

  consultaIndicadores(){
    return this.httpClient.get<Respuesta>(environment.api_programa + 'seguimiento_indicador/consultaIndicadores', this.httpOptions);
  }
}
