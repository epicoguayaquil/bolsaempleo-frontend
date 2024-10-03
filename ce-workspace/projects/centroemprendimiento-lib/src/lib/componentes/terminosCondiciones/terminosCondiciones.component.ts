import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, inject } from '@angular/core';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ComponentForm } from '../../modelos/ComponentForm';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormMensageErrorComponent } from '../formMensageError/formMensageError.component';
import { TagModule } from 'primeng/tag';

import { TerminosReferenciaService } from '../../servicios/TerminosReferencia.service';

@Component({
  selector: 'app-terminosCondiciones',
  templateUrl: './terminosCondiciones.component.html',
  styleUrls: ['./terminosCondiciones.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,CardModule, ButtonModule,
    InputGroupModule, InputGroupAddonModule, IconFieldModule, InputIconModule, CheckboxModule,
    InputTextModule, InputSwitchModule, FormMensageErrorComponent, TagModule
  ],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TerminosCondicionesComponent),
      multi: true,
    }
  ]
})
export class TerminosCondicionesComponent extends ComponentForm {
  override formDatos: FormGroup<any>;
  formDatosTodos: FormGroup<any>;

  verTerminosCondiciones: boolean = false;
  @Input() override submited: boolean = false;

  @Input() terminos: { [key: string]: boolean } = {'AUTORIZACION_MEDIOS_PUBLICITARIOS': false, 
  'AUTORIZACION_DATOS_PERSONALES': false};

  listaTerminosCondiciones: Array<any> = [];

  private terminosReferenciaService:TerminosReferenciaService = inject(TerminosReferenciaService);

  constructor() {
    super();
    this.formDatosTodos =  this.formBuilder.group({
      'marcar_todos': [null],
    });

    this.formDatos =  this.formBuilder.group({});

    let terminos:Array<string> = [];
    for (const key in this.terminos) {
      const value = this.terminos[key];
      if (value) {
        this.formDatos.addControl(key, this.formBuilder.control(true, [Validators.required]));
      } else {
        this.formDatos.addControl(key, this.formBuilder.control(true));
      }
      if(key == 'TERMINOS_REGISTRO_CE'){
        this.formDatos.addControl('uso_datos', this.formBuilder.control(null, [Validators.required]));
      }
      terminos.push(key);
    }
    this.consultarTerminos(terminos);

    this.formDatos.valueChanges.subscribe(val => {
      if(!this.listaTerminosCondiciones){
        return;
      }
      const allChecked = this.listaTerminosCondiciones.every(termino => this.formDatos.get(termino.nombre)?.value === true);
      this.formDatosTodos.get('marcar_todos')?.setValue(allChecked, { emitEvent: false });
    });
  }

  override getValues () {
    let values = super.getValues();
    values.uso_datos = values.uso_datos ? 'SI' : 'NO';
    return values;
  }

  override setValues(values: any): void {
    if(values){
      let val = {uso_datos: values.uso_datos == 'SI'};
      super.setValues(val);
    }
  }

  // retorna true cuando es invalido
  override fieldIsValid(nameField: any): boolean | undefined {
    let validacion = super.fieldIsValid(nameField);
    if(this.terminos[nameField] && this.submited){
      return !this.formDatos.controls[nameField].value;
    }else{
      if(this.listaTerminosCondiciones){
        const termino = this.listaTerminosCondiciones.find( element => element.nombre == nameField);
        if(termino && termino.es_obligatorio){
          return !this.formDatos.controls[nameField].value;
        }
      }
    }
    return validacion;
  }

  override isValid(validateForm?: boolean | null): boolean | undefined {
    let valido = super.isValid(validateForm);
    if(valido){
      for (const key in this.terminos) {
        if(this.fieldIsValid(key)){
          return false;
        }
      }
    }
    return valido;
  }

  toggleAll() {
    const checked = this.formDatosTodos.get('marcar_todos')?.value;
    this.listaTerminosCondiciones.forEach(termino => {
      this.formDatos.get(termino.nombre)?.setValue(checked, { emitEvent: false });
    });
  }
  
  consultarTerminos(terminos){
    this.terminosReferenciaService.terminosCondiciones(terminos).subscribe(data => {
      this.listaTerminosCondiciones = data.data;
      this.listaTerminosCondiciones.forEach(termino => {
        if(termino.es_obligatorio){
          this.addValidatorControl(this.formDatos.controls[termino.nombre], Validators.required);
        }
      });
    });
  }

}
