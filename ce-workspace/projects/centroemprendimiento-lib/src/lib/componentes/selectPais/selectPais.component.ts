import { Component, Input, forwardRef } from '@angular/core';
import { SelectModel } from '../../modelos/SelectModel';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-selectPais',
  templateUrl: './selectPais.component.html',
  styleUrls: ['./selectPais.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectPaisComponent),
      multi: true
    }
  ], 
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectPaisComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() isNacionalidad: boolean = true;
  @Input() override loadLocal: boolean = true; // carga las provincias locales del EC y no considera cambio de PAIS
  override nemonicoCatalogo = 'PAIS';
  label:string = 'nombre';
  placeHolder: string = 'Selecciona el país';
  override fieldIdName: string = 'codigo';

  constructor() {
    super();
    this.label = this.isNacionalidad ? 'nacionalidad' : this.label;
    this.placeHolder = this.isNacionalidad ? 'Selecciona tu nacionalidad' : this.placeHolder;
  }

  override loadList(): void {
    if(!this.loadLocal){
      this.loading = true;
      this.catalogoService.get('PAIS').subscribe( data =>{
        this.listaItems = data.data;
        this.loading = false;
      });
    }
  }
}