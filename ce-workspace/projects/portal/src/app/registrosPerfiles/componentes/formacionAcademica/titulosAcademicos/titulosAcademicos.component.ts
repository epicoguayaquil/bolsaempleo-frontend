import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ComponentForm, FormMensageErrorComponent, SelectNivelAcademicoComponent, SelectSituacionLaboralComponent, UpperCaseInputDirective } from '../../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-titulosAcademicos',
  templateUrl: './titulosAcademicos.component.html',
  styleUrls: ['./titulosAcademicos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormMensageErrorComponent,
    InputTextModule, SelectSituacionLaboralComponent, SelectNivelAcademicoComponent,
    InputGroupModule, InputGroupAddonModule, InputTextareaModule, InputSwitchModule,
    TableModule, InputMaskModule, ButtonModule, InputIconModule, IconFieldModule, UpperCaseInputDirective
  ],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TitulosAcademicosComponent),
      multi: true,
    }
  ]
})
export class TitulosAcademicosComponent extends ComponentForm {
  override formDatos: FormGroup<any> = this.formBuilder.group({});

  @Input() override submited: boolean = false;

  listaTitulosAcademicos:any[] = [];

  override setValues (values: any) {
    if(values){
      values.forEach(item =>{
        item.estado_registro = item.estado_registro ? item.estado_registro : 'A';
        this.agregarTitulo(item);
      });
    }
  }

  override getValues() {
    return this.listaTitulosAcademicos;
  }

  agregarTitulo(item:any|null=null){
    if(item){
      item.actualidad = item.fecha_fin == null;
      item.index = this.listaTitulosAcademicos.length + 1;
    }else{
      item = {id:null, carrera_titulo:null, id_instituto:null, instituto: null, actualidad: false, index: this.listaTitulosAcademicos.length + 1, fecha_inicio: null, fecha_fin:null, estado_registro: 'A' };
    }
    this.listaTitulosAcademicos.push(item);
    this.agregarControl(item);
  }

  removerTitulo(titulo){
    if(titulo.id){
      titulo.estado_registro = 'E';
    }else{
      this.listaTitulosAcademicos.splice(titulo.index-1, 1);
    }
    this.removerControl(titulo.index);
  }

  revertirEliminados(){
    let titulosEliminados = this.listaTitulosAcademicos.filter(item => item.estado_registro == 'E');
    titulosEliminados.forEach(item => {item.estado_registro = 'A'; this.agregarControl(item)});
  }

  private agregarControl(item){
    this.formDatos.addControl('carrera_titulo'+item.index, this.formBuilder.control(item.carrera_titulo, [Validators.required]) );
    this.formDatos.addControl('instituto'+item.index, this.formBuilder.control(item.instituto, [Validators.required]) );
    this.formDatos.addControl('fechainicio'+item.index, this.formBuilder.control(item.fecha_inicio, [Validators.required]) );
    this.formDatos.addControl('fechafin'+item.index, this.formBuilder.control(item.fecha_fin, [Validators.required]) );
    this.formDatos.addControl('vigente'+item.index, this.formBuilder.control(item.actualidad, [Validators.required]) );
    this.vigente(item);
  }

  private removerControl(index){
    this.formDatos.removeControl('carrera_titulo'+index);
    this.formDatos.removeControl('instituto'+index);
    this.formDatos.removeControl('fechainicio'+index);
    this.formDatos.removeControl('fechafin'+index);
    this.formDatos.removeControl('vigente'+index);
  }

  vigente(titulo){
    if(!this.formDatos.controls['vigente'+titulo.index]){
      return;
    }
    if(this.formDatos.controls['vigente'+titulo.index].value){
      this.listaTitulosAcademicos.forEach(item => {
        if(item.index != titulo.index && item.actualidad && titulo.actualidad){
          this.formDatos.controls['vigente'+titulo.index].setValue(false);
          titulo.actualidad = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Solo puede tener un registro de titulación en vigencia'});
        }
      });
      if(titulo.actualidad){
        this.formDatos.controls['fechafin'+titulo.index].setValidators(null);
        this.formDatos.controls['fechafin'+titulo.index].disable();
        this.formDatos.controls['fechafin'+titulo.index].reset();
      }
    }else{
      this.formDatos.controls['fechafin'+titulo.index].setValidators([Validators.required]);
      this.formDatos.controls['fechafin'+titulo.index].enable();
    }
  }

  getListaTitulosAcademicos(){
    return this.listaTitulosAcademicos.filter(element => element.estado_registro != 'E');
  }
}
