import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';
import { ConfigService } from '../../servicios/ConfigService.service';

@Component({
  selector: 'app-compartiRedesSociales',
  templateUrl: './compartiRedesSociales.component.html',
  styleUrls: ['./compartiRedesSociales.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,OverlayPanelModule, InputTextModule, InputGroupAddonModule, InputGroupModule,
    ButtonGroupModule, ButtonModule, ClipboardModule]
})
export class CompartiRedesSocialesComponent{

  private clipboard: Clipboard = inject(Clipboard);
  private messageService: MessageService = inject(MessageService);
  private configService:ConfigService = inject(ConfigService);

  @Input() titulo: string = "";
  @Input() tituloCompartir: string = "";
  @Input() path: any;
  @Input() baseURL: any = this.configService.environment.baseSharedURL;
  @Input() viewBtnPopup: any = true;
  @ViewChild('opCompartir') private popupCompartir?: OverlayPanel;

  UrlDefaul = 'https://epico.gob.ec/ce_des/pacto_ciudadano/empleos';

  compartir(event){
    this.popupCompartir?.toggle(event);
  }

  getUrl(){
    return  this.baseURL + this.path;
  }

  copiar(){
    this.clipboard.copy(this.getUrl());
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copiado con exito' });
  }

  comparirEnRedSocial(redSocial){
    let url = '';
    let urlCompartir = this.getUrl();
    if(!this.configService.environment.production){
      urlCompartir = this.UrlDefaul;
    }
    switch(redSocial){
      case 'FACEBOOK':
        url = this.configService.urlSharedRedesSociales.facebook + encodeURIComponent(urlCompartir);
        break;
      case 'TWITTER':
        url = this.configService.urlSharedRedesSociales.twitter + urlCompartir;
        break;
      case 'WHATSAPP':
        url = this.configService.urlSharedRedesSociales.whatsapp + 'Hola te comparto lo siguiente: ' + urlCompartir;
        break;
    }
    if(url){
      console.log('URL generada: ', url);
      window.open(url, '_BLANK');
    }
  }

  visibleMore(){
    return navigator.share;
  }

  shareMore() {
    const shareData = {
      title: this.tituloCompartir,
      text: 'Hola te comparto lo siguiente:',
      url: this.getUrl()
    }

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Contenido compartido con éxito'))
        .catch((error) => console.error('Error al compartir:', error));
    } else {
      console.error('El Web Share API no está soportado en este navegador');
      // Alternativa para navegadores que no soportan Web Share API
      alert('Compartir no es compatible con este navegador. Intenta copiar y pegar el enlace manualmente.');
    }
  }
}
