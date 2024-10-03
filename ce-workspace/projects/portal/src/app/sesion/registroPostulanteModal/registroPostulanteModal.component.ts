import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { RegistroPostulanteComponent } from '../../registrosPerfiles/registroPostulante/registroPostulante.component';

@Component({
  selector: 'app-registroPostulanteModal',
  templateUrl: './registroPostulanteModal.component.html',
  styleUrls: ['./registroPostulanteModal.component.css'],
  standalone: true,
  imports: [DialogModule, RegistroPostulanteComponent]
})
export class RegistroPostulanteModalComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() registrado: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelar: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  _cancelar(){
    this.closeDialog();
    this.cancelar.emit(true);
  }
}
