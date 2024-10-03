import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { Observable, catchError, throwError } from "rxjs";

export class ResponseErrorInterceptorService implements HttpInterceptor {

  private messageService:MessageService = inject(MessageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status == 400 && error.error) {
        const errores = error.error.error;
        if(errores){
          Object.entries(errores).forEach(([key, value]) =>{
            const details = value as string[];
            this.messageService.add({ severity: 'error', summary: 'Error', detail: details[0] });
          } );
        }
      }
      if (error.status == 500) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error. Por favor notificar al Administrador del Sistema.' });
      }
      return throwError(() => error );
    }))
  }
}