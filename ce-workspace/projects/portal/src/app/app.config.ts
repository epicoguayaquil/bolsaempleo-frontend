import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RoutePortalStrategy } from './sesion/servicios/RouterPortalStrategy';
import { ResponseErrorInterceptorService } from './sesion/servicios/ResponseErrorInterceptor.service';
import { AutenticarInterceptorService } from './sesion/servicios/autenticarInterceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom([HttpClientModule]),
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: AutenticarInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseErrorInterceptorService, multi: true, deps: [MessageService]},
    { provide: RouteReuseStrategy, useClass: RoutePortalStrategy }
  ]
};
