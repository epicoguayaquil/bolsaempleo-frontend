import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { ComponentForm, FormMensageErrorComponent, SelectCiudadComponent, SelectEstadoCivilComponent, SelectGeneroComponent, SelectPaisComponent, SelectProvinciaComponent, UpperCaseInputDirective, validAge, validarIdentificacion } from '../../../../../../centroemprendimiento-lib/src/public-api';
@Component({
  selector: 'app-datosPersonales',
  templateUrl: './datosPersonales.component.html',
  styleUrls: ['./datosPersonales.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectButtonModule, FormMensageErrorComponent,
    FloatLabelModule, SelectCiudadComponent, SelectProvinciaComponent, SelectGeneroComponent,
    InputTextModule, InputMaskModule, SelectEstadoCivilComponent, InputSwitchModule,
    IconFieldModule, InputIconModule, TagModule, SelectPaisComponent, UpperCaseInputDirective
  ],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatosPersonalesComponent),
      multi: true,
    }
  ]
})
export class DatosPersonalesComponent extends ComponentForm {

  @Input() override submited: boolean = false;
  @Input() loading: boolean = false;
  @Output() consultarCedula = new EventEmitter();
  @Input() classFiels: string = 'col-12 sm:col-12 md:col-6 lg:col-6 xl:col-6';

  tiposIdentificacion: any[] = [{ label: 'Cédula', value: 'C' },{ label: 'Pasaporte', value: 'P' }];

  override formDatos =  this.formBuilder.group({
    'tipo_identificacion': new FormControl('C', Validators.required),
    'identificacion': new FormControl(null, Validators.required),
    'nombre': new FormControl(null, Validators.required),
    'apellido': new FormControl(null, Validators.required),
    'id_genero': new FormControl(null, Validators.required),

    // nacionalidad
    'pais_natal': new FormControl(null, Validators.required),
    'id_ciudad_nacimiento': new FormControl(null, Validators.required),

    // domicilio
    'id_provincia': new FormControl('', Validators.required),
    'id_ciudad': new FormControl(null, Validators.required),

    'id_estado_civil': new FormControl(null, Validators.required),
    'carnet_discapacidad': new FormControl(false, Validators.required),
    'fecha_nacimiento': new FormControl(null, [Validators.required, validAge(18, 100)]),
    'telefono': new FormControl(null, [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.minLength(10), Validators.maxLength(15)]),
    'telefono_fijo': new FormControl(null, [Validators.pattern('[- +()0-9]+'), Validators.minLength(7), Validators.maxLength(15)]),
    'email': new FormControl(null, [Validators.required, Validators.email]),
    'id':new FormControl(),
    'id_persona': new FormControl(),
  }, {
    validators: [validarIdentificacion]
  });

  constructor() { 
    super();
  }

  consultarDatos(){
    console.log('Consultar: ', this.formDatos.controls['identificacion']);
    if(this.formDatos.controls['identificacion'].valid){
      this.consultarCedula.emit();
    }
  }

  override setValues(values: any): void {
    if(values && (values.id_persona || values.id) ){
      values.id_persona = values.id_persona ? values.id_persona : values.id;
      values.id = values.id ? values.id : values.id_persona;
    }
    if(values && (typeof values.carnet_discapacidad == 'undefined' || values.carnet_discapacidad == null)){
      values.carnet_discapacidad = false;
    }
    super.setValues(values);
  }

  override clear(): void {
    this.formDatos.controls['tipo_identificacion'].setValue('C');
    super.clear();  
  }
}


export interface DatosPersonales{
  id?:number | string;
  tipo_identificacion: 'C'|'P'|'R';
  identificacion: string;
  nombre: string;
  apellido: string;
  id_genero?: number | string;
  id_provincia: number | string;
  id_estado_civil?: number | string;
  id_ciudad?: number | string;
  carnet_discapacidad?:any;
  fecha_nacimiento?: string;
  telefono?: string;
  telefono_fijo?: string;
  email: string;
  id_persona?:number | string;
}