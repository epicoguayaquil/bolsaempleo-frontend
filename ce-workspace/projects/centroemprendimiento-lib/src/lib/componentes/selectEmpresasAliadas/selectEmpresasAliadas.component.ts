import { Component, Input, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModel } from '../../modelos/SelectModel';
import { DialogModule } from 'primeng/dialog';
import { FormMensageErrorComponent } from '../formMensageError/formMensageError.component';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {SeguimientoIndicadorService} from '../../servicios/SeguimientoIndicador.service';

@Component({
  selector: 'app-selectEmpresasAliadas',
  templateUrl: './selectEmpresasAliadas.component.html',
  styleUrls: ['./selectEmpresasAliadas.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectEmpresasAliadasComponent),
      multi: true
    }
  ],
  imports: [InputGroupModule, DropdownModule, 
    FormsModule, ReactiveFormsModule, DialogModule, FormMensageErrorComponent,
    InputTextModule, CommonModule, SelectButtonModule, ButtonModule, InputIconModule,
    InputGroupAddonModule, IconFieldModule]
})
export class SelectEmpresasAliadasComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() permitirAgregar: boolean = false;

  visibleModal = false;
  formDatos: FormGroup;
 
  constructor(
    private seguimientoIndicadorService: SeguimientoIndicadorService,
    private messageService: MessageService,
    private formBuilder: FormBuilder) {
    super();
    this.formDatos =  this.formBuilder.group({
      'nombre': [null, Validators.compose([Validators.required])],
      'estado': ['A', Validators.compose([Validators.required])]
    });
    //this.probarComponent = 'SelectEmpresasAliadasComponent';
  }

  override loadList(): void {
    this.loading = true;
    this.catalogoService.get('INDICADORES_EMPRESAS_ALIADAS').subscribe( data =>{
      this.listaItems = data.data;
      this.loading = false;
      this.loadSelectItem();
    });
  }

  nuevo(){
    this.visibleModal = true;
  }

  guardar(){
    if(this.formDatos.invalid){
      return;
    }
    let empresa = {...this.formDatos.value};
    this.seguimientoIndicadorService.crearEmpresa(empresa).subscribe( data =>{
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