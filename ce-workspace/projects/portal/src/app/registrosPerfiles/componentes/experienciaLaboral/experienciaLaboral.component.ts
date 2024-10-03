import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ComponentForm, FormMensageErrorComponent } from '../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-experienciaLaboral',
  templateUrl: './experienciaLaboral.component.html',
  styleUrls: ['./experienciaLaboral.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormMensageErrorComponent, InputSwitchModule,
    InputTextModule
  ],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExperienciaLaboralComponent),
      multi: true,
    }
  ]
})
export class ExperienciaLaboralComponent extends ComponentForm {

  @Input() override submited: boolean = false;

  override formDatos:any =  this.formBuilder.group({
    'is_trabajando': [false, [Validators.required]],
    'has_experiencia': [false, [Validators.required]],
    'cargo': [null],
    'organizacion': [null],
    'id_postulante': [null],
    'id': [null]
  });

  constructor() { 
    super();
  }

  resetValidadorExperiencia(){
    if (!this.formDatos.controls['has_experiencia'].value) {
      if (!this.formDatos.controls['is_trabajando'].value) {
        this.formDatos.controls['cargo'].clearValidators();
        this.formDatos.controls['organizacion'].clearValidators();
      }else{
        this.formDatos.controls['cargo'].setValidators([Validators.required, Validators.maxLength(500)]);
        this.formDatos.controls['organizacion'].setValidators([Validators.required, Validators.maxLength(500)]);
      }
    } else {
      this.formDatos.controls['cargo'].setValidators([Validators.required, Validators.maxLength(500)]);
      this.formDatos.controls['organizacion'].setValidators([Validators.required, Validators.maxLength(500)]);
    }
    this.formDatos.controls['cargo'].updateValueAndValidity();
    this.formDatos.controls['organizacion'].updateValueAndValidity();
  }

  override setValues(values: any): void {
    super.setValues(values);
    if(typeof values == 'undefined' || values == null){
      this.formDatos.controls['is_trabajando'].setValue(false);
      this.formDatos.controls['has_experiencia'].setValue(false);
      return;
    }
    if(typeof values.has_experiencia == 'undefined'){
      this.formDatos.controls['has_experiencia'].setValue(false);
    }
    if(typeof values.is_trabajando == 'undefined'){
      this.formDatos.controls['is_trabajando'].setValue(false);
    }
  }

}
