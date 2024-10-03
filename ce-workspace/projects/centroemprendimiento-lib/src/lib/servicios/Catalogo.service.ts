import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Respuesta } from '../interfaces/Respuesta';
import { ConfigService } from './ConfigService.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private configService:ConfigService = inject(ConfigService);
  private httpClient: HttpClient = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  get(catalogo:string, params?:any) {
    if(catalogo =='CIUDAD'){
      console.log('Parametros carga ciudad: ', params);
    }
    let httpOptions = {...this.httpOptions, params: params};
    return this.httpClient.get<Respuesta>(this.configService.environment.api_seguridad + 'catalogo/'+catalogo, httpOptions);
  }

  
}
