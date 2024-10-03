import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Message } from 'primeng/api';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-formMensageError',
  templateUrl: './formMensageError.component.html',
  styleUrls: ['./formMensageError.component.css'],
  standalone: true,
  imports: [TagModule, CommonModule]
})
export class FormMensageErrorComponent implements OnInit {

  @Input() control:AbstractControl | undefined;
  @Input() submited:boolean = false;
  messages: Message[] | null | undefined;

  constructor() { }

  ngOnInit() {
  }

  mostrarError(){
    if(!this.control){
      return false;
    }
    return this.control.invalid && (this.submited || this.control.touched);
  }

  getMensajes(){
    this.messages = null;
    if(!this.control?.errors){
      return this.messages;
    }
    if(!this.mostrarError()){
      return this.messages;
    }
    if(this.control.errors['required']){
      this.messages = !this.messages ? [] : this.messages;
      this.messages.push({ severity: 'error', detail: 'Este campo es requerido' });
    }

    if(this.control.errors['max']){
      this.messages = !this.messages ? [] : this.messages;
      this.messages.push({ severity: 'error', detail: 'El valor máximo ' + this.control.errors["max"]["max"] });
    }

    if(this.control.errors['min']){
      this.messages = !this.messages ? [] : this.messages;
      this.messages.push({ severity: 'error', detail: 'El valor mínimo' + this.control.errors["min"]["min"] });
    }

    if(this.control.errors['minlength']){
      this.messages = !this.messages ? [] : this.messages;
      this.messages.push({ severity: 'error', detail: 'Debe tener una longitud mínima de ' + this.control.errors["minlength"]["requiredLength"] });
    }

    if(this.control.errors['maxlength']){
      this.messages = !this.messages ? [] : this.messages;
      this.messages.push({ severity: 'error', detail: 'Debe tener una longitud máxima de ' + this.control.errors["maxlength"]["requiredLength"] });
    }
    return this.messages;
  }

}
