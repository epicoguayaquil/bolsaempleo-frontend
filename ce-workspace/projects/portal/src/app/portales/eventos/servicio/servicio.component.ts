import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { MessagesModule } from 'primeng/messages';
import { BannerEventosComponent } from '../bannerEventos/bannerEventos.component';
import { ActivatedRoute, Params } from '@angular/router';
import { EventosService } from '../../servicios/Eventos.service';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';
import { PanelModule } from 'primeng/panel';
import { TimelineModule } from 'primeng/timeline';
import { Servicio } from '../interfaces/Servicio';
import { CompartiRedesSocialesComponent, General } from '../../../../../../centroemprendimiento-lib/src/public-api';
import { LoginService, TipoRegistro } from '../../../sesion/servicios/login.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, ButtonGroupModule, ButtonModule,
    CompartiRedesSocialesComponent, ConfirmDialogModule, MessagesModule, BannerEventosComponent, DividerModule,
    PanelModule, TimelineModule
  ]
})
export class ServicioComponent implements OnInit {

  @Input() servicio?:Servicio;
  @Input() path:string = '';

  public id_edicion:number = 0;
  public mostrarCabecera:boolean = false;
  public className:string = '';
  public style:any = {'width': '100%'};
  public imagenDefault = "assets/images/eventoDefault.png";

  private rutaActiva: ActivatedRoute = inject(ActivatedRoute);
  private eventoService: EventosService = inject(EventosService);
  private loginService: LoginService = inject(LoginService);
  private metaService: Meta = inject(Meta);
  private titleService: Title = inject(Title);
  private renderer: Renderer2 = inject(Renderer2);

  ngOnInit() {
    this.loginService.tipoRegistro = TipoRegistro.PERSONA;
    this.metaService.updateTag({ property: 'og:title', content: 'SERVICIOS EPICO' });
    this.rutaActiva.params.subscribe(
      (params: Params) => {  
        if (params['id_edicion']) {
          this.id_edicion = params['id_edicion'];
          this.eventoService.servicio(this.id_edicion).subscribe({
            next: (data:any)=> {
              this.servicio = data.data;
              this.path = data.path;
              this.mostrarCabecera = true;
              this.className = 'btn-page2';
              this.style = {'width': '90%'};
              this.updateMetaTags();
            },
            error: (err)=> {
              this.servicio = undefined;
            }
          });
        }
      }
    );

    this.renderer.setStyle(document.body, 'backgroundColor', '#57B2D9');
    this.renderer.setStyle(document.body, 'backgroundImage', 'none');
  }

  updateMetaTags() {
    if(!this.servicio){
      return;
    }
    this.titleService.setTitle(this.servicio.nombre);

    //this.metaService.updateTag({ name: 'description', content: this.oferta.descripcion });

    this.metaService.updateTag({ property: 'og:url', content: `${environment.domain}servicio/${this.servicio.id}` });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:title', content: this.servicio.nombre });
    if(this.servicio.descripcion_edi){
      this.metaService.updateTag({ property: 'og:description', content: this.servicio.descripcion_edi });
    }
    this.metaService.updateTag({ property: 'og:image', content: this.getLogo() });
  }

  getLogo(){
    return this.servicio?.logo ? (this.path + this.servicio?.logo) : ( environment.domain + this.imagenDefault);
  }

  registrarse(){
    window.open(this.servicio?.url, '_BLANK');
  }

  getFechaFormato(fecha:any){
    return General.getFechaFormat(fecha);
  }
}
