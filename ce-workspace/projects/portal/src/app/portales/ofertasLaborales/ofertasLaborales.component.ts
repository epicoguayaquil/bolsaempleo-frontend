import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ImageModule } from 'primeng/image';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { EmpleabilidadService } from '../servicios/Empleabilidad.service';
import { RatingModule } from 'primeng/rating';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { OfertaLaboralComponent } from './ofertaLaboral/ofertaLaboral.component';
import { BannerOfertasLaboralesComponent } from './bannerOfertasLaborales/bannerOfertasLaborales.component';
import { LoginService, TipoRegistro } from '../../sesion/servicios/login.service';
import { Subscription } from 'rxjs';
import { BadgeModule } from 'primeng/badge';
import { RegistroPostulanteModalComponent } from '../../sesion/registroPostulanteModal/registroPostulanteModal.component';
import { CompartiRedesSocialesComponent, FiltrosComponent, ParametrosFiltro, ParametrosOptions } from '../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-ofertasLaborales',
  templateUrl: './ofertasLaborales.component.html',
  styleUrls: ['./ofertasLaborales.component.css'],
  standalone: true,
  imports: [CommonModule, FiltrosComponent, DataViewModule, CardModule, FieldsetModule,
    ImageModule, FormsModule, ReactiveFormsModule, ButtonModule, DialogModule, DividerModule,
    RatingModule, OverlayPanelModule, InputTextModule, InputGroupAddonModule, InputGroupModule,
    ButtonGroupModule, CompartiRedesSocialesComponent, OfertaLaboralComponent, BannerOfertasLaboralesComponent,
    BadgeModule, RegistroPostulanteModalComponent
  ]
})
export class OfertasLaboralesComponent implements OnInit, AfterViewInit {
  
  ofertas_laborales: any[] = [];
  layout: 'list' | 'grid' = 'list';
  logoDefault = "assets/images/sin-logo.png";
  path: string = '';
  oferta:any;

  rows:number = 5;
  page:number = 1;
  totalRecords:number = 0;

  parametros: ParametrosFiltro={};
  options: ParametrosOptions={
    institucion: false,
    organizacion: true,
    ciudades:true,
    tipo_etiqueta: 'EMPLEABILIDAD',
    etiquetas: false
  }

  private empleabilidadService: EmpleabilidadService = inject(EmpleabilidadService);
  private loginService: LoginService = inject(LoginService);
  private subscription: Subscription | undefined;
  private sesionIniciada:boolean = false;

  constructor(){
    this.loginService.tipoRegistro = TipoRegistro.POSTULANTE;
    this.loginService.observeLoginStatus().subscribe( isLogin => {
      if(isLogin){
        this.loading = true;
        this.sesionIniciada = isLogin;
        this.subscription = this.loginService.consultarParametrosPerfil('POSTULANTE').subscribe(data =>{
          this.consultaOfertas();
        });
      }else{
        if(this.subscription){
          this.subscription.unsubscribe();
          this.subscription = undefined;
        }
        if(this.sesionIniciada !== isLogin){
          this.consultaOfertas();
        }
        this.sesionIniciada = isLogin;
      }
    });
  }

  loading: boolean = false;

  ngOnInit() {
    this.consultaOfertas();
  }

  ngAfterViewInit(): void {
    
  }

  onPage(event: any) {
    this.page = (event.first + event.rows)/event.rows;
    this.rows = event.rows;
    this.consultaOfertas();
  }

  consultaOfertas(){
    this.loading = true;
    this.loginService.getParametrosPerfil().then( params =>{
      let parametros = {...params, ...this.parametros};
      this.empleabilidadService.ofertasLaborales(this.rows, this.page, parametros).subscribe({
        next: (data:any)=> {
          this.ofertas_laborales = data.data;
          if(this.ofertas_laborales && this.ofertas_laborales.length > 0){
            this.oferta = this.ofertas_laborales[0];
          }
          this.path = data.path;
          this.totalRecords = data.records;
          this.loading = false;
          },
          error: (err)=> {
            this.loading = false;
            this.ofertas_laborales = [];
          }
      });
    });
    
  }

  selectOferta(oferta:any){
    this.oferta = oferta;
  }

  consultarPorFiltros(){
    this.page = 1;
    this.consultaOfertas();
  }

  tituloCompartir="Compartir oferta laboral";
  eventoCompartir:any;
  compartir(event:any, oferta:any){
    this.eventoCompartir = null;
    setTimeout( ()=>{
      this.eventoCompartir = event;
    }, 200);
  }

  getSeverity(product: any): string | undefined {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warning';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return undefined;
    }
  };

  cambiarLayaout(event: any, layout:any){
    
  }
}
