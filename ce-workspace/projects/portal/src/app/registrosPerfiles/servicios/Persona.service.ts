import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Persona } from '../interfaces/Persona';
import { environment } from '../../../../../environments/environment';
import { Respuesta } from '../../../../../centroemprendimiento-lib/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  private httpClient:HttpClient = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getPersona(identificacion: string){
    return this.httpClient.post<RespuestaPersona>(environment.api_persona + 'persona/get', {identificacion: identificacion}, this.httpOptions);
  }

  createPersona(params: Persona){
    return this.httpClient.post<Respuesta>(environment.api_persona + 'persona/create', params, this.httpOptions)
  }

  updatePersona(params: Persona, id){
    return this.httpClient.put<Respuesta>(environment.api_persona + 'persona/update/'+id, params, this.httpOptions)
  }

  getEtiqueta(id:number, tipo_etiqueta:string = 'INTERES'){
    return this.httpClient.get<Respuesta>(environment.api_persona + 'persona/get/'+id+'/'+tipo_etiqueta, this.httpOptions);
  }

  terminosCondiciones(params: Array<string>){
    return this.httpClient.post<Respuesta>(environment.api_persona + 'persona/terminos_condiciones', {'terminos': params}, this.httpOptions)
  }

  createUsuarioPerfilDefault(params: Persona){
    return this.httpClient.post<Respuesta>(environment.api_persona + 'persona/perfil/usuario/default', params, this.httpOptions)
  }
}

export interface RespuestaPersona extends Respuesta{
  data:Persona;
}