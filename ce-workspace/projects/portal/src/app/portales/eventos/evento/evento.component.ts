import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { EventosService } from '../../servicios/Eventos.service';
import { environment } from '../../../../../../environments/environment';
import { LoginService, TipoRegistro } from '../../../sesion/servicios/login.service';
import { BannerEventosComponent } from '../bannerEventos/bannerEventos.component';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Evento } from '../interfaces/Evento';
import { CompartiRedesSocialesComponent } from '../../../../../../centroemprendimiento-lib/src/public-api';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, ButtonGroupModule, ButtonModule,
    CompartiRedesSocialesComponent, ConfirmDialogModule, MessagesModule, BannerEventosComponent, DividerModule,
    RadioButtonModule, SkeletonModule
  ]
})
export class EventoComponent implements OnInit {

  @Input() evento?:Evento;
  @Input() path:string = '';

  private rutaActiva: ActivatedRoute = inject(ActivatedRoute);
  private metaService: Meta = inject(Meta);
  private titleService: Title = inject(Title);
  private eventoService: EventosService = inject(EventosService);
  private loginService: LoginService = inject(LoginService);
  private renderer: Renderer2 = inject(Renderer2);
  private messageService:MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);

  public id_evento:number = 0;
  public loading = false;
  public mostrarCabecera:boolean = false;
  public className:string = '';
  public style:any = {'width': '100%'};
  public messages:any[]=[];
  public imagenDefault = "assets/images/eventoDefault.png";

  public id_tipo_asistencia:number|null|undefined;

  constructor(){
    this.loginService.tipoRegistro = TipoRegistro.PERSONA;
    this.metaService.updateTag({ property: 'og:title', content: 'EVENTOS EPICO' });
    this.rutaActiva.params.subscribe(
      (params: Params) => {  
        if (params['id_evento']) {
          this.id_evento = params['id_evento'];
          this.eventoService.evento(this.id_evento).subscribe({
            next: (data:any)=> {
              this.evento = data.data;
              this.path = data.path;
              this.mostrarCabecera = true;
              this.className = 'btn-page2';
              this.style = {'width': '90%'};
              this.updateMetaTags();
              this.verificarPostulacion();
            },
            error: (err)=> {
              this.loading = false;
            },
          });
        }
      }
    );
  }

  ngOnInit() {
    this.renderer.setStyle(document.body, 'backgroundColor', '#57B2D9');
    this.renderer.setStyle(document.body, 'backgroundImage', 'none');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['evento'] && changes['evento'].currentValue){
      this.verificarPostulacion();
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.body, 'backgroundColor');
    this.renderer.removeStyle(document.body, 'backgroundImage');
  }

  updateMetaTags() {
    if(!this.evento){
      return;
    }
    this.titleService.setTitle(this.evento.nombre);

    //this.metaService.updateTag({ name: 'description', content: this.oferta.descripcion });

    this.metaService.updateTag({ property: 'og:url', content: `${environment.domain}evento/${this.evento.id}` });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:title', content: this.evento.nombre });
    this.metaService.updateTag({ property: 'og:description', content: this.evento.contenido });
    this.metaService.updateTag({ property: 'og:image', content: this.getLogo() });
  }

  getLogo(){
    return this.evento?.logo ? (this.path + this.evento?.logo) : ( environment.domain + this.imagenDefault);
  }
  

  verificarPostulacion(){
    this.messages = [];
    if(this.evento?.id_postulacion){
      this.messages = [
        { severity: 'info', summary: 'Ya te encuentras registrado' }
      ];
    }
  }

  registrarse(){
    if(this.evento?.accion == 'PROGRAMA'){
      window.open(this.evento.url, '_BLANK');
      return;
    }

    this.loginService.isAuthenticated().then( sesion =>{
      if(sesion){
        if(this.evento?.id_tipo_asistencia){
          this.id_tipo_asistencia = this.evento.id_tipo_asistencia;
          this._registrarme();
        }else{
          this.confirmarModalidad();
        }
      }else{
        this.loginService.openLogin();
      }
    });
  }

  confirmarModalidad(){
    this.confirmationService.confirm({
      header: 'Asistencia',
      message: 'Selecciona tu asistencia',
      accept: () => {
        console.log('Aceptar');
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Has cancelado la inscripción', life: 3000 });
      }
    });
  }

  aceptarModalidad(){
    if(this.id_tipo_asistencia){
      this._registrarme();
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debes seleecionar una de las opciones de asistencia', life: 3000 });
    }
  }

  _registrarme(){
    this.loading = true;
    let agenda:any = {
      tema: this.evento?.nombre,
      tipo: this.evento?.tipo_evento,
      id_tipo_asistencia: this.id_tipo_asistencia,
      id_evento: this.evento?.id
    };

    this.eventoService.registrarseEvento(agenda).subscribe({
      next: (data) => {
        this.loading = false;
        if(this.evento?.id_tipo_asistencia){this.confirmationService.close();}
        if(data.codigo == '1' || data.codigo == '2'){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: data.mensaje });
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.mensaje });
        }
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
      },
    });
  }
}
