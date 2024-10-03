import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ComponentForm, FormMensageErrorComponent, SelectModalidadComponent, SelectRangoSalarialComponent } from '../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-expectativaLaboral',
  templateUrl: './expectativaLaboral.component.html',
  styleUrls: ['./expectativaLaboral.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormMensageErrorComponent, InputTextModule,
    SelectRangoSalarialComponent, SelectModalidadComponent, InputTextareaModule
  ],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExpectativaLaboralComponent),
      multi: true,
    }
  ]
})
export class ExpectativaLaboralComponent extends ComponentForm {

  @Input() override submited: boolean = false;

  override formDatos:any =  this.formBuilder.group({
    'id_rango_salarial': [false, [Validators.required]],
    'id_modalidad': [false, [Validators.required]],
    'observacion': [null],
    'id_postulante': [null],
    'id': [null],
    'id_usuario': [null]
  });

  constructor() { 
    super();
  }

  resetValidadorExperiencia(){
    if (!this.formDatos.controls['has_experiencia'].value) {
      this.formDatos.controls['cargo'].clearValidators();
      this.formDatos.controls['organizacion'].clearValidators();
    } else {
      this.formDatos.controls['cargo'].setValidators([Validators.required, Validators.maxLength(500)]);
      this.formDatos.controls['organizacion'].setValidators([Validators.required, Validators.maxLength(500)]);
    }
    this.formDatos.controls['cargo'].updateValueAndValidity();
    this.formDatos.controls['organizacion'].updateValueAndValidity();
  }
}