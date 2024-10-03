import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Respuesta } from '../interfaces/Respuesta';
import { ConfigService } from './ConfigService.service';

@Injectable({
    providedIn: 'root'
})
export class TerminosReferenciaService {

    private httpClient:HttpClient = inject(HttpClient);
    private configService:ConfigService = inject(ConfigService);

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    terminosCondiciones(params: Array<string>){
        return this.httpClient.post<Respuesta>(this.configService.environment.api_persona + 'terminos_condiciones/consulta', {'terminos': params}, this.httpOptions)
    }
}
