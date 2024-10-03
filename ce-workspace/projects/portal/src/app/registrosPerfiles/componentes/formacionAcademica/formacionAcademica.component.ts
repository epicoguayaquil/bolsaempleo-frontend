import { Component, Input, ViewChild, forwardRef } from '@angular/core';
import { FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { InputMaskModule } from 'primeng/inputmask';
import { TitulosAcademicosComponent } from './titulosAcademicos/titulosAcademicos.component';
import { TagModule } from 'primeng/tag';
import { FileCVBase64 } from '../../interfaces/Persona';
import { ComponentForm, FormMensageErrorComponent, SelectNivelAcademicoComponent, SelectSituacionLaboralComponent, validarHojaVida } from '../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-formacionAcademica',
  templateUrl: './formacionAcademica.component.html',
  styleUrls: ['./formacionAcademica.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormMensageErrorComponent,
    InputTextModule, SelectSituacionLaboralComponent, SelectNivelAcademicoComponent,
    FileUploadModule, InputGroupModule, InputGroupAddonModule, InputTextareaModule,
    TableModule, InputMaskModule, TitulosAcademicosComponent, TagModule
  ],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormacionAcademicaComponent),
      multi: true,
    }
  ]
})
export class FormacionAcademicaComponent extends ComponentForm {

  @Input() override submited: boolean = false;
  @ViewChild('fileCV') private fileCV: FileUpload | undefined;
  @ViewChild('titulosAcademicos') private titulosAcademicos: TitulosAcademicosComponent | undefined;

  override formDatos =  this.formBuilder.group({
    'id_situacion_laboral': [null, [Validators.required]],
    'id_nivel_academico': [null, [Validators.required]],
    'descripcion_perfil': [null, [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]],
    'linkedin': new FormControl(),
    'file_cv': new FormControl(),
    'id_postulante': new FormControl(),
    'redes_sociales': new FormControl(),
    'titulos_academicos': [null],
    'file_cv_base64': new FormControl(),
    'cv': new FormControl()
  },{
    validators: [validarHojaVida]
  });

  constructor() { 
    super();
  }

  viewcancelarFile=false;
  onSelect(event: any) {
    let self = this;
    this.formDatos.patchValue({'file_cv': event.currentFiles[0]});
    this.viewcancelarFile = true;
    const reader = new FileReader();
    reader.onload = function() {
        const base64File = reader.result?.toString().split(',')[1]; // Remove data URL part
        const filename = event.currentFiles[0].name;
        const extension = filename.split('.').pop(); // Obtener la extensión del archivo
        const payload:FileCVBase64 = {
            filename: event.currentFiles[0].name,
            content: base64File,
            contentType: event.currentFiles[0].type,
            extension: extension 
        };
        self.formDatos.controls['file_cv_base64'].setValue(payload);
    };
    reader.readAsDataURL(event.currentFiles[0]);
  }

  cancelar(){
    this.viewcancelarFile = false;
    this.fileCV?.clear();
    this.formDatos.controls['file_cv'].setValue(null);
  }

  override clear(){
    super.clear();
  }

  override setValues (values: any) {
    super.setValues(values);
    if(values?.redes_sociales){
      this.formDatos.controls['redes_sociales'].setValue(values.redes_sociales);
      let red_social = values.redes_sociales.find(element => (element.id == 6 || element.id_red_social == 6));
      if(red_social){
        this.formDatos.controls['linkedin'].setValue(red_social.red);
      }else{
        let redes_sociales = [...this.formDatos.controls['redes_sociales'].value];
        redes_sociales.push({id: 6, id_red_social: 6, red: ""});
        this.formDatos.controls['redes_sociales'].setValue(redes_sociales);
      }
    }
    if(values?.file_cv){
      this.fileCV?.files.push(values?.file_cv);
      this.viewcancelarFile = true;
    }
  }

  override getValues() {
    let values = super.getValues();
    if(this.formDatos.controls['redes_sociales'].value){
      let redes_sociales = [...this.formDatos.controls['redes_sociales'].value];
      if (values.linkedin) {
        let red_social:any = redes_sociales.find((element:any) => element.id == 6 || element.id_red_social == 6);
        if(red_social){red_social.red = values.linkedin};
      }else{
        redes_sociales.splice(redes_sociales.findIndex((element:any) => element.id == 6 || element.id_red_social == 6), 1);
      }
      values.redes_sociales = redes_sociales;
    }

    //values.titulos_academicos = this.listaTitulosAcademicos;
    values.is_estudiante = false;
    if(values.titulos_academicos){
      let estudioActual = values.titulos_academicos.find((element:any) => element.actualidad === true);
      if(estudioActual){
        values.is_estudiante = true;
      }
    }
    return values;
  }

  override isValid(validateForm?: boolean): boolean | undefined {
    return super.isValid(validateForm) && this.titulosAcademicos?.isValid(validateForm);
  }

}
