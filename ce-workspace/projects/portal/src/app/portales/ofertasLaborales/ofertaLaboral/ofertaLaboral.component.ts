import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Params } from '@angular/router';
import { EmpleabilidadService } from '../../servicios/Empleabilidad.service';
import { BannerOfertasLaboralesComponent } from '../bannerOfertasLaborales/bannerOfertasLaborales.component';
import { LoginService, TipoRegistro } from '../../../sesion/servicios/login.service';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { CompartiRedesSocialesComponent } from '../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-ofertaLaboral',
  templateUrl: './ofertaLaboral.component.html',
  styleUrls: ['./ofertaLaboral.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, ButtonGroupModule, ButtonModule,
    CompartiRedesSocialesComponent, BannerOfertasLaboralesComponent, ConfirmDialogModule, MessagesModule
  ]
})
export class OfertaLaboralComponent implements OnInit {

  @Input() oferta:any;
  @Input() path:string = '';
  style:any = {'width': '100%'};
  private rutaActiva: ActivatedRoute = inject(ActivatedRoute);
  private empleabilidadService: EmpleabilidadService = inject(EmpleabilidadService);
  private messageService:MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

  mostrarCabecera:boolean = false;
  className:string = '';
  logoDefault = "assets/images/sin-logo.png";

  private loginService: LoginService = inject(LoginService);
  private metaService: Meta = inject(Meta);
  private titleService: Title = inject(Title);

  public id_oferta:number = 0;
  public loading = false;
  public visibleMensaje:boolean = true;

  constructor(){
    this.loginService.tipoRegistro = TipoRegistro.POSTULANTE;
  }

  ngOnInit() {
   this.rutaActiva.params.subscribe(
      (params: Params) => {  
        if (params['id_oferta']) {
          this.id_oferta = params['id_oferta'];
          this.loginService.isAuthenticated().then( sesion =>{
            if(sesion){
              this.loginService.getParametrosPerfil().then( parametros =>{
                if(!parametros || !parametros.id_postulante){
                  this.loginService.consultarParametrosPerfil('POSTULANTE').subscribe(data =>{
                    this.consultaOfertaLaboral();
                  });
                }else{
                  this.consultaOfertaLaboral();
                }
              });
            }else{
              this.consultaOfertaLaboral();
            }
          });
        }
      }
    );
  }

  consultaOfertaLaboral(){
    this.loginService.getParametrosPerfil().then( parametros =>{
      this.empleabilidadService.ofertaLaboral(this.id_oferta, parametros).subscribe({
        next: (data:any)=> {
          this.oferta = data.data;
          this.path = data.path;
          this.mostrarCabecera = true;
          this.className = 'btn-page';
          this.style = {'width': '90%'};
          this.updateMetaTags();
          this.verificarPostulacion();
        },
        error: (err)=> {
            this.loading = false;
        }
      });
    });
  }

  getLogo(){
    return this.oferta?.logo ? (this.path + this.oferta?.logo) : this.logoDefault;
  }

  postular(){
    this.loginService.isAuthenticated().then( sesion =>{
      if(sesion){
        this._postular();
      }else{
        this.loginService.openLogin();
      }
    });
  }

  _postular(){
    this.loginService.getParametrosPerfil().then(params =>{
      if(!params || !params.id_postulante){
        this.visibleMensaje = true;
        this.confirmacionCompletarInformacion();
        return;
      }
      this.loading = true;
      this.empleabilidadService.postular(this.oferta.id).subscribe({
        next: (data) => {
          this.loading = false;
          if(data.codigo == '1' || data.codigo == '2'){
            this.oferta.id_postulacion = data.data;
            this.verificarPostulacion();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.mensaje });
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.mensaje });
          }
          if(this.oferta.url_externa){
            window.open(this.oferta.url_externa, '_BLANK');
          }
          this.loading = false;
        },
        error: (response) => {
          this.loading = false;
        },
      });
    });
  }

  updateMetaTags() {
    this.titleService.setTitle(this.oferta.titulo);

    //this.metaService.updateTag({ name: 'description', content: this.oferta.descripcion });

    this.metaService.updateTag({ property: 'og:url', content: `${environment.domain}oferta/${this.oferta.id}` });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:title', content: this.oferta.titulo });
    //this.metaService.updateTag({ property: 'og:description', content: this.oferta.descripcion });
    this.metaService.updateTag({ property: 'og:image', content: this.getLogo() });
  }

  messages:any[]=[];
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['oferta'] && changes['oferta'].currentValue){
      this.verificarPostulacion();
    }
  }

  verificarPostulacion(){
    this.messages = [];
    if(this.oferta.id_postulacion){
      this.messages = [
        { severity: 'info', summary: 'Tu postulación esta siendo revisada' }
      ];
    }
  }

  confirmacionCompletarInformacion(){
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: 'Para poder postular debes completar tu información. <br><br> <strong>¿Deseas completar tus datos?</strong>',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      acceptLabel: 'Si',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.loginService.register();
        this.visibleMensaje = false;
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Has cancelado la postulación' });
        this.visibleMensaje = false;
      }
  });
  }
}
