import { Component, Input, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { SelectModel } from '../../modelos/SelectModel';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectProvincia',
  templateUrl: './selectProvincia.component.html',
  styleUrls: ['./selectProvincia.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectProvinciaComponent),
      multi: true
    }
  ], 
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectProvinciaComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() pais: string = 'EC';
  @Input() override loadLocal: boolean = true; // carga las provincias locales del EC y no considera cambio de PAIS
  @ViewChild('select') private select: Dropdown | undefined;
  override nemonicoCatalogo = 'PROVINCIA_LOCAL';

  constructor() {
    super();
  }

  override loadList(): void {
    if(!this.loadLocal){
      this.loading = true;
      this.catalogoService.get('PROVINCIA', {pais: this.pais}).subscribe( data =>{
        this.listaItems = data.data;
        this.loading = false;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["pais"] && changes["pais"].currentValue){
      this.select?.clear();
      this.pais = changes["pais"].currentValue;
      this.loadList();
    }
  }
}