import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputMaskModule } from 'primeng/inputmask';
import { ComponentForm, FormMensageErrorComponent, SelectEtapaEmprendimientoComponent, SelectFiguraLegalComponent, SelectMultipleTipoFinanciamientoComponent, SelectTipoEmprendimientoComponent, SelectTipoRegimenComponent } from '../../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-emprendimiento',
  templateUrl: './emprendimiento.component.html',
  styleUrls: ['./emprendimiento.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormMensageErrorComponent, SelectTipoEmprendimientoComponent, 
    SelectEtapaEmprendimientoComponent, InputTextModule, InputTextareaModule, InputSwitchModule, SelectMultipleTipoFinanciamientoComponent,
    SelectButtonModule, SelectFiguraLegalComponent, SelectTipoRegimenComponent, InputMaskModule],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmprendimientoComponent),
      multi: true,
    }
  ]
})
export class EmprendimientoComponent extends ComponentForm {

  @Input() classFiels: string = 'col-12 sm:col-12 md:col-6 lg:col-6 xl:col-6';

  opcionesSINO = [{label: 'SI', value: 'SI'}, {label: 'NO', value: 'NO'}];

  override formDatos =  this.formBuilder.group({
    'id': [null],
    'nombre': [null, [Validators.required]],
    'id_tipo_emprendimiento': [null, [Validators.required]],
    'id_etapa_emprendimiento': [null, [Validators.required]],
    'descripcion': [null, [Validators.required]],

    'esta_formalizado': [null, [Validators.required]],
    'persona': [null],
    'opera_ruc_rise': [null],
    'ruc_rise': [null],
    'desea_formalizarse': [null],

    'realizado_prestado': [null, [Validators.required]],
    'tipos_financimiento': [null],
  });

  constructor() { 
    super();
  }
  
  formalizado(){
    if(this.formDatos.controls['esta_formalizado'].value == 'NO'){
      this.formDatos.controls['persona'].setValue(null);
      this.formDatos.controls['opera_ruc_rise'].setValue(null);
      this.formDatos.controls['ruc_rise'].setValue(null);
      this.removeSpecificValidatorControl(this.formDatos.controls['persona'], Validators.required);
      this.removeSpecificValidatorControl(this.formDatos.controls['opera_ruc_rise'], Validators.required);
      this.removeSpecificValidatorControl(this.formDatos.controls['ruc_rise'], Validators.required);
      this.addValidatorControl(this.formDatos.controls['desea_formalizarse'], Validators.required);
    }else{
      this.addValidatorControl(this.formDatos.controls['persona'], Validators.required);
      this.addValidatorControl(this.formDatos.controls['opera_ruc_rise'], Validators.required);
      this.addValidatorControl(this.formDatos.controls['ruc_rise'], Validators.required);
      this.removeSpecificValidatorControl(this.formDatos.controls['desea_formalizarse'], Validators.required);
    }
  }

  realizadoPrestamo(){
    if(this.formDatos.controls['realizado_prestado'].value == 'NO'){
      this.formDatos.controls['tipos_financimiento'].setValue(null);
      this.removeSpecificValidatorControl(this.formDatos.controls['tipos_financimiento'], Validators.required);
    }else{
      this.addValidatorControl(this.formDatos.controls['tipos_financimiento'], Validators.required);
    }
  }
}
