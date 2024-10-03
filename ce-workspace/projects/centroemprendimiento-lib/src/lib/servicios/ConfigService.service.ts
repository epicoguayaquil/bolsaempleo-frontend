import { Injectable } from '@angular/core';
import { environment as defaultEnvironment, UrlSharedRedesSociales as defaultUrlSharedRedesSociales } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _environment = { ...defaultEnvironment };
  private _UrlSharedRedesSociales = { ...defaultUrlSharedRedesSociales };

  set environment(env: any) {
    this._environment = { ...defaultEnvironment, ...env };
  }

  get environment(): any {
    return this._environment;
  }

  set urlSharedRedesSociales(env: any) {
    this._UrlSharedRedesSociales = { ...defaultEnvironment, ...env };
  }

  get urlSharedRedesSociales(): any {
    return this._UrlSharedRedesSociales;
  }

}