import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigService } from './ConfigService.service';
import { Respuesta } from '../interfaces/Respuesta';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoIndicadorService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private httpClient = inject(HttpClient);
  private configService:ConfigService = inject(ConfigService);

  crearEmpresa(empresa:any){
    return this.httpClient.post<Respuesta>(this.configService.environment.api_programa + 'seguimiento_indicador/empresa_aliada', empresa, this.httpOptions);
  }

  crearPrograma(programa:any){
    return this.httpClient.post<Respuesta>(this.configService.environment.api_programa + 'seguimiento_indicador/programa', programa, this.httpOptions);
  }

  crearIndicador(indicador:any){
    return this.httpClient.post<Respuesta>(this.configService.environment.api_programa + 'seguimiento_indicador/create', indicador, this.httpOptions);
  }

  actualizarIndicador(indicador:any, id){
    return this.httpClient.put<Respuesta>(this.configService.environment.api_programa + 'seguimiento_indicador/update/'+id, indicador, this.httpOptions);
  }

  consultaIndicadores(){
    return this.httpClient.get<Respuesta>(this.configService.environment.api_programa + 'seguimiento_indicador/consultaIndicadores', this.httpOptions);
  }
}
