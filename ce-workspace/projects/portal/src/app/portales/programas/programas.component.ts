import { Component, inject, OnInit } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { ImageModule } from 'primeng/image';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { EventosViewListComponent } from '../eventos/eventosViewList/eventosViewList.component';
import { AccordionModule } from 'primeng/accordion';
import { BannerEventosComponent } from '../eventos/bannerEventos/bannerEventos.component';
import { ServiciosViewListComponent } from '../eventos/serviciosViewList/serviciosViewList.component';
import { FiltrosComponent, ParametrosFiltro, ParametrosOptions } from '../../../../../centroemprendimiento-lib/src/public-api';
import { LoginService, TipoRegistro } from '../../sesion/servicios/login.service';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.css'],
  standalone: true,
  imports: [DividerModule, FieldsetModule, ImageModule, FiltrosComponent, FormsModule, ReactiveFormsModule,
    AccordionModule, EventosViewListComponent, CommonModule, BadgeModule, AvatarModule, CardModule, CalendarModule,
    BannerEventosComponent, ServiciosViewListComponent
  ]
})
export class ProgramasComponent implements OnInit {

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

  months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  mesNombreSeleccionado:string = '';
  fechaSeleccionada:any = new Date();
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
