import { Component, Input, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { SelectModel } from '../../modelos/SelectModel';
import { DialogModule } from 'primeng/dialog';
import { FormMensageErrorComponent } from '../formMensageError/formMensageError.component';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';

import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import {SeguimientoIndicadorService} from '../../servicios/SeguimientoIndicador.service';

@Component({
  selector: 'app-selectSubPrograma',
  templateUrl: './selectSubPrograma.component.html',
  styleUrls: ['./selectSubPrograma.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSubProgramaComponent),
      multi: true
    }
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule, DialogModule,
    FormMensageErrorComponent, CommonModule, SelectButtonModule, InputGroupModule,
    ButtonModule, InputIconModule, IconFieldModule, InputGroupAddonModule
  ]
})
export class SelectSubProgramaComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @ViewChild('select') private select: Dropdown | undefined;
  @Input() id_programa: any;
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
      'estado': ['A', Validators.compose([Validators.required])],
      'id_programa_padre': [this.id_programa, Validators.compose([Validators.required])]
    });
    this.probarComponent = 'SelectSubProgramaComponent';
  }

  override loadList(): void {
    if(!this.id_programa || this.id_programa == null){
      return;
    }
    this.loading = true;
    this.catalogoService.get('INDICADORES_SUB_RPOGRAMA', {id_programa: this.id_programa}).subscribe( data =>{
      this.listaItems = data.data;
      this.loading = false;
      this.loadSelectItem(this.valueInput);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["id_programa"] && changes["id_programa"].currentValue){
      this.select?.clear();
      this.id_programa = changes["id_programa"].currentValue;
      this.formDatos.controls['id_programa_padre'].setValue(this.id_programa);
      this.loadList();
    }
  }

  nuevo(){
    if(!this.id_programa){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar primero el programa' });
      return;
    }
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