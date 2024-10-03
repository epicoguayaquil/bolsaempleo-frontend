import { Routes } from '@angular/router';

export const routes: Routes = [
  /*{
    path: 'portal',
    children: [*/
      { 
        path: 'ofertas',
        loadComponent: ()=> import('./portales/ofertasLaborales/ofertasLaborales.component').then( m => m.OfertasLaboralesComponent)
      },
      { 
        path: 'oferta/:id_oferta',
        loadComponent: ()=> import('./portales/ofertasLaborales/ofertaLaboral/ofertaLaboral.component').then(m=> m.OfertaLaboralComponent)
      },
      {
        path: 'eventos',
        loadComponent: ()=> import('./portales/eventos/eventos.component').then(m=> m.EventosComponent)
      },
      {
        path: 'evento/:id_evento',
        loadComponent: ()=> import('./portales/eventos/evento/evento.component').then(m => m.EventoComponent)
      },
      {
        path: 'servicios',
        loadComponent: ()=> import('./portales/programas/programas.component').then(m=> m.ProgramasComponent)
      },
      {
        path: 'servicio/:id_edicion',
        loadComponent: ()=> import('./portales/eventos/servicio/servicio.component').then(m => m.ServicioComponent)
      },
      {
        path: 'indicadores',
        loadComponent: ()=> import('./portales/indicadores/indicadores.component').then(m => m.IndicadoresComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: ()=> import('./portales/home/home.component').then(m=>m.HomeComponent)
      }
    /*]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'portal'
  }*/
];
