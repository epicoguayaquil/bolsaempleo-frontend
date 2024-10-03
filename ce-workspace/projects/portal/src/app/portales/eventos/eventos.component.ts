import { Component, inject, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { ImageModule } from 'primeng/image';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { EventosViewListComponent } from './eventosViewList/eventosViewList.component';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { BannerEventosComponent } from './bannerEventos/bannerEventos.component';
import { ServiciosViewListComponent } from './serviciosViewList/serviciosViewList.component';
import { FiltrosComponent, General, ParametrosFiltro, ParametrosOptions } from '../../../../../centroemprendimiento-lib/src/public-api';
import { LoginService, TipoRegistro } from '../../sesion/servicios/login.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  standalone: true,
  imports: [DividerModule, FieldsetModule, ImageModule, FiltrosComponent, FormsModule, ReactiveFormsModule,
    AccordionModule, EventosViewListComponent, CommonModule, BadgeModule, AvatarModule, CardModule, CalendarModule,
    BannerEventosComponent, ServiciosViewListComponent
  ]
})
export class EventosComponent implements OnInit {

  private loginService: LoginService = inject(LoginService);
  loading:boolean = false;
  parametros: ParametrosFiltro={};
  options: ParametrosOptions={
    institucion: false,
    ciudades:false,
    tipo_etiqueta: 'INTERES',
    etiquetas: true,
    fecha_desde: false,
    fecha_hasta: false,
    organizacion:false
  }

  months = General.months;  
  fechaSeleccionada:any = new Date();
  mesNombreSeleccionado:string = '';
  mesSeleccionado:number = this.fechaSeleccionada.getMonth() + 1;
  anioSeleccionado:number = this.fechaSeleccionada.getFullYear();

  constructor(){
    this.loginService.tipoRegistro = TipoRegistro.PERSONA;
  }

  ngOnInit(): void {
    this.mesSeleccionado = this.fechaSeleccionada.getMonth() + 1;
    this.mesNombreSeleccionado = this.months[this.fechaSeleccionada.getMonth()];
    this.anioSeleccionado = this.fechaSeleccionada.getFullYear();
  }

  visibleCalendario:boolean = false;
  cambiarFecha(){
    this.visibleCalendario = !this.visibleCalendario;
  }

  onSelectFecha(event:any){
    this.mesSeleccionado = this.fechaSeleccionada.getMonth() + 1;
    this.mesNombreSeleccionado = this.months[this.fechaSeleccionada.getMonth()];
    this.anioSeleccionado = this.fechaSeleccionada.getFullYear();
    this.visibleCalendario = false;
  }

  buscar(event:any){
    setTimeout(() => {
      this.loading = false
    }, 2000);
  }
}
