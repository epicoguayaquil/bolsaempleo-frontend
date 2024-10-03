import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { EventosService } from '../../servicios/Eventos.service';
import { Servicio } from '../interfaces/Servicio';
import { CompartiRedesSocialesComponent, General } from '../../../../../../centroemprendimiento-lib/src/public-api';
import { environment } from '../../../../../../environments/environment';
import { LoginService, TipoRegistro } from '../../../sesion/servicios/login.service';

@Component({
  selector: 'app-serviciosViewList',
  templateUrl: './serviciosViewList.component.html',
  styleUrls: ['./serviciosViewList.component.css'],
  standalone: true,
  imports: [DataViewModule, CommonModule, ButtonModule, OverlayModule, OverlayPanelModule,
    MenuModule, TagModule, ButtonGroupModule, CompartiRedesSocialesComponent, RouterLink
  ]
})
export class ServiciosViewListComponent implements OnInit {

  fechaActual = new Date();
  @Input() mes:number = this.fechaActual.getMonth();
  @Input() anio:number = this.fechaActual.getFullYear();

  rows:number = 8;
  page:number = 1;
  totalRecords:number = 0;
  loading:boolean = false;
  path: string = '';

  layout: 'list' | 'grid' = 'grid';

  imagenDefault = "assets/images/eventoDefault.png";
  mesNombreSeleccionado:string="";

  private eventosService: EventosService = inject(EventosService);
  private router: Router= inject(Router);
  private loginService: LoginService = inject(LoginService);
  listaservicios:Servicio[] = [];

  constructor(){
    this.loginService.tipoRegistro = TipoRegistro.PERSONA;
  }

  ngOnInit() {
    this.consultarServicios();
    this.mesNombreSeleccionado = General.months[this.mes-1];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['mes'] && changes['mes'].currentValue){
      this.mes = changes['mes'].currentValue;
      this.mesNombreSeleccionado = General.months[this.mes-1];
      this.page = 1; 
      this.consultarServicios();
    }
    if(changes['anio'] && changes['anio'].currentValue){
      this.anio = changes['anio'].currentValue;
      this.page = 1;
      this.consultarServicios();
    }
  }

  onPage(event: any) {
    this.page = (event.first + event.rows)/event.rows;
    this.rows = event.rows;
    this.consultarServicios();
  }

  consultarServicios(){
    this.loading = true;
    let params:any={};
    params.anio = this.anio;
    params.mes = this.mes;
    this.eventosService.servicios(this.rows, this.page, params).subscribe({
      next: (data:any)=> {
        this.loading = false;
        this.path = data.path;
        this.listaservicios = data.data;
        this.totalRecords = data.records;
      },
      error: (err)=> {
        this.loading = false;
        this.listaservicios = [];
      },
    });
  }

  verServicio(servicio:Servicio){
    this.router.navigate(['servicio/'+servicio.id]);
  }

  getImageEvento(item:Servicio){
    return item.imagen ? (this.path + item.imagen) : ( environment.domain + this.imagenDefault);
  }

  setDefaultImage(event: Event): void {
    // Cambia la fuente de la imagen al valor por defecto.
    const element = event.target as HTMLImageElement;
    element.src = this.imagenDefault;
  }
  
  getSeverity(evento: any): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch (evento.estado) {
        case 'A':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'I':
            return 'danger';

        default:
            return undefined;
    }
  };

}
