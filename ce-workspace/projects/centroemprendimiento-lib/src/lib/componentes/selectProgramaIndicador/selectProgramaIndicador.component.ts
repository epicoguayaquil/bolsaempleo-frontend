import { Component, Input, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModel } from '../../modelos/SelectModel';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { FormMensageErrorComponent } from '../formMensageError/formMensageError.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {SeguimientoIndicadorService} from '../../servicios/SeguimientoIndicador.service';

@Component({
  selector: 'app-selectProgramaIndicador',
  templateUrl: './selectProgramaIndicador.component.html',
  styleUrls: ['./selectProgramaIndicador.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectProgramaIndicadorComponent),
      multi: true
    }
  ],
  imports: [InputGroupModule, DialogModule, FormMensageErrorComponent, InputTextModule,
    CommonModule, SelectButtonModule, ButtonModule, FormsModule, ReactiveFormsModule, DropdownModule,
    InputIconModule, InputGroupAddonModule, IconFieldModule
  ]
})
export class SelectProgramaIndicadorComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() permitirAgregar: boolean = false;
  formDatos: FormGroup;
  visibleModal = false;

  constructor(
    private seguimientoIndicadorService: SeguimientoIndicadorService,
    private messageService: MessageService,
    private formBuilder: FormBuilder) {
    super();
    this.formDatos =  this.formBuilder.group({
      'nombre': [null, Validators.compose([Validators.required])],
      'estado': ['A', Validators.compose([Validators.required])]
    });
  }

  override loadList(): void {
    this.loading = true;
    this.catalogoService.get('INDICADORES_PROGRAMA').subscribe( data =>{
      this.listaItems = data.data;
      this.loading = false;
    });
  }

  nuevo(){
    this.visibleModal = true;
  }

  guardar(){
    if(this.formDatos.invalid){
      return;
    }
    let programa = {...this.formDatos.value};
    this.seguimientoIndicadorService.crearPrograma(programa).subscribe( data =>{
      if(data.codigo == '1'){
        this.visibleModal = false;
        this.loadList();
        this.selectItem = data.data;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registrado con exito' });
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: data.mensaje });
      }
    });
  }

  fieldIsValid (nameField) {
    return this.formDatos.controls[nameField].invalid && 
          (this.formDatos.controls[nameField].dirty || 
            this.formDatos.controls[nameField].touched ||
            this.submited)
  }
}