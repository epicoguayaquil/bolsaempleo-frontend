import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RegistroPersonaComponent } from '../../registrosPerfiles/registroPersona/registroPersona.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-registroPersonaModal',
  templateUrl: './registroPersonaModal.component.html',
  styleUrls: ['./registroPersonaModal.component.css'],
  standalone: true,
  imports:[RegistroPersonaComponent, DialogModule]
})
export class RegistroPersonaModalComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() registrado: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  showDialog() {
    this.visible = true;
    this.visibleChange.emit(this.visible);
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  toggleVisibility() {
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
  }

  _registrado(event){
    this.closeDialog();
    this.registrado.emit(event)
  }
}
