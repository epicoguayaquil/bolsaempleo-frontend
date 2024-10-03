import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Persona } from '../interfaces/Persona';
import { Postulante } from '../interfaces/Postulante';
import { ParametroRegistroPostulante } from '../interfaces/Parametros';
import { Respuesta } from '../../../../../centroemprendimiento-lib/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class PostulanteService {

  private httpClient:HttpClient = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getPostulante(identificacion: string){
    return this.httpClient.post<RespuestaPostulante>(environment.api_persona + 'postulante/get', {identificacion: identificacion}, this.httpOptions);
  }

  getPostulanteUsuario(){
    return this.httpClient.post<RespuestaPostulante>(environment.api_persona + 'postulante/porusuario', null, this.httpOptions);
  }

  createPostulante(params: ParametroRegistroPostulante){
    return this.httpClient.post<Respuesta>(environment.api_persona + 'postulante/create', params, this.httpOptions)
  }
}

export interface RespuestaPostulante extends Respuesta{
  data:{persona:Persona, postulante: Postulante};
}