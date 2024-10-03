import { Injectable, inject } from '@angular/core';
import { LoginService } from './login.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { MessageService } from 'primeng/api';

@Injectable()
export class AutenticarInterceptorService implements HttpInterceptor {

    
  private AUTH_HEADER = "TokenEpico";
  private token:string|any = "";

  private loginService: LoginService = inject(LoginService);
  private messageService:MessageService = inject(MessageService);

  intercept(
      req: HttpRequest<any>,
      next: HttpHandler
  ): Observable<HttpEvent<any>> {
      if (req.url.includes(environment.auth)) {
          return next.handle(req);
      }

      let showSpin = true;
      if (req.body && req.body.constructor.name == HttpParams.name) {
          if (req.body.get('showSpin') != null || req.body.get('showSpin') != undefined) {
              showSpin = String(req.body.get('showSpin')) == 'true';
          }
      }

      /*if (req.body && req.body.constructor.name == Object.name) {
          if (req['showSpin'] != null || req['showSpin'] != undefined) {
              showSpin = String(req['showSpin']) == 'true';
          }
      }*/

      if (req.url.includes('catalogo')) {
          showSpin = false;
      }
      
      if (showSpin){
          //General.loading();
      }

      req = this.addAuthenticationToken(req);
      return this.sendRequest(next, req, showSpin);
  }

  private sendRequest(next:any, req:any, showSpin:any){
      return next.handle(req)
          .pipe(
              tap(evt => {
                  if (evt instanceof HttpResponse) {
                      if (showSpin){
                          //General.closeLoading();
                      }

                      if(evt.body.token){ 
                          this.token = evt.body.token;
                          evt.body.token = '';
                          this.loginService.saveToken(this.token);
                      }else{
                          // console.log(evt);
                      }
                  }
              }),
              catchError((error: HttpErrorResponse) => {
                  if (!req.url.includes('catalogo') && !req.url.includes('getResumen') && !req.url.includes('formulario/grabarRegistro')
                      && !req.url.includes('reunion/actualizar')&& !req.url.includes('dashboard/getSesiones')) {
                      //General.closeLoading();
                  }
                  if (error.status == 401) {
                      //this.mensajeService.alertEpico('Sesion caducada', 'Su sesión ha caducado');
                      this.loginService.logout();
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No esta autorizado para realizar esta petición' });
                      //this.router.navigate([environment.login]);
                  } else {
                      //this.mensajeService.alertError('Error', 'Ha ocurrido un error inesperado, Consulte con el Administrador de sistemas');
                  }
                  return throwError(() => error );
              }),
              finalize(() => {
                  /*console.log(req);
                  console.log(this.token);*/
              })
          );
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
      // If we do not have a token yet then we should not set the header.
      // Here we could first retrieve the token from where we store it.
      //this.token = sessionStorage.getItem('token');
      this.loginService.getToken().then(token => {
        this.token = token;
      });

      if (!this.token) {
          return request;
      }
      // If you are calling an outside domain then do not add the token.
      /*if (!request.url.match(/localhost\//)) {
          return request;
      }*/
      let nRequest = request.clone({
          headers: request.headers.set(this.AUTH_HEADER, this.token)
      });
      return nRequest;
  }

}