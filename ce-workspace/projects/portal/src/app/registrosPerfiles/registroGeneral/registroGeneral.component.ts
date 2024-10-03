import { Component, EventEmitter, OnInit, Output, Renderer2, RendererFactory2, inject } from '@angular/core';
import { RegistroPersonaComponent } from '../registroPersona/registroPersona.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-registroGeneral',
  templateUrl: './registroGeneral.component.html',
  styleUrls: ['./registroGeneral.component.css'],
  standalone: true,
  imports: [RegistroPersonaComponent, CardModule
  ]
})
export class RegistroGeneralComponent implements OnInit {

  @Output() registrado = new EventEmitter<boolean>();

  private rendererFactory: RendererFactory2 = inject(RendererFactory2);
  private renderer: Renderer2;

  constructor(){
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  ngOnInit() {
    this.renderer.setStyle(document.body, 'background-image', 'none');
    this.renderer.setStyle(document.body, 'background-color', '#15B4E9');
  }

  ngOnDestroy() {
    this.renderer.removeStyle(document.body, 'background-image');
  }

  _registrado(event){
    this.registrado.emit(event);
  }
  
}
