import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { OverlayModule } from 'primeng/overlay';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { EventosService } from '../../servicios/Eventos.service';
import { Router, RouterLink } from '@angular/router';
import { LoginService, TipoRegistro } from '../../../sesion/servicios/login.service';
import { Evento } from '../interfaces/Evento';
import { CompartiRedesSocialesComponent } from '../../../../../../centroemprendimiento-lib/src/public-api';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-eventosViewList',
  templateUrl: './eventosViewList.component.html',
  styleUrls: ['./eventosViewList.component.css'],
  standalone: true,
  imports: [DataViewModule, CommonModule, ButtonModule, OverlayModule, OverlayPanelModule,
    MenuModule, TagModule, ButtonGroupModule, CompartiRedesSocialesComponent, RouterLink
  ]
})
export class EventosViewListComponent implements OnInit {

  fechaActual = new Date();
  @Input() mes:number = this.fechaActual.getMonth();
  @Input() anio:number = this.fechaActual.getFullYear();

  rows:number = 8;
  page:number = 1;
  totalRecords:number = 0;
  loading:boolean = false;

  private eventosService: EventosService = inject(EventosService);
  private loginService:LoginService = inject(LoginService);
  private router: Router= inject(Router);
  listaEventos:Evento[] = [];
  path: string = '';

  layout: 'list' | 'grid' = 'grid';
  items: MenuItem[] | undefined;

  imagenDefault = "assets/images/eventoDefault.png";
  
  constructor() {
    this.loginService.tipoRegistro = TipoRegistro.PERSONA;
  }

  ngOnInit() {
    this.consultarEventos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['mes'] && changes['mes'].currentValue){
      this.mes = changes['mes'].currentValue;
      this.page = 1; 
      this.consultarEventos();
    }
    if(changes['anio'] && changes['anio'].currentValue){
      this.anio = changes['anio'].currentValue;
      this.page = 1;
      this.consultarEventos();
    }
  }

  consultarEventos(){
    this.loading = true;
    this.loginService.getParametrosPerfil().then(params =>{
      params.anio = this.anio;
      params.mes = this.mes;
      this.eventosService.eventos(this.rows, this.page, params).subscribe({
        next: (data:any)=> {
          this.loading = false;
          this.listaEventos = data.data;
          this.totalRecords = data.records;
          this.path = data.path;
        },
        error: (err)=> {
          this.loading = false;
          this.listaEventos = [];
        },
      });
    });
    
  }

  getImageEvento(item:Evento){
    return item.imagen ? (this.path + item.imagen) : (environment.domain + this.imagenDefault);
  }

  setDefaultImage(event: Event): void {
    // Cambia la fuente de la imagen al valor por defecto.
    const element = event.target as HTMLImageElement;
    element.src = this.imagenDefault;
  }

  onPage(event: any) {
    this.page = (event.first + event.rows)/event.rows;
    this.rows = event.rows;
    this.consultarEventos();
  }

  verEvento(evento:Evento){
    this.router.navigate(['evento/'+evento.id]);
  }

  getSeverity(evento: Evento): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
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
