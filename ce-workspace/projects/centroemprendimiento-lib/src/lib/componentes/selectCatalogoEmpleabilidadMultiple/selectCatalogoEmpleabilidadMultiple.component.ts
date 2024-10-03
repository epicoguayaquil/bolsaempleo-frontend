import { Component, Input, OnInit, SimpleChanges, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectMultipleModel } from '../../modelos/SelectMultipleModel';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-selectCatalogoEmpleabilidadMultiple',
  templateUrl: './selectCatalogoEmpleabilidadMultiple.component.html',
  styleUrls: ['./selectCatalogoEmpleabilidadMultiple.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCatalogoEmpleabilidadMultipleComponent),
      multi: true
    }
  ],
  imports: [MultiSelectModule, FormsModule, ReactiveFormsModule]
})
export class SelectCatalogoEmpleabilidadMultipleComponent extends SelectMultipleModel implements OnInit {
    
  @Input() override returnId: boolean = true;
  @Input() tipo_catalogo: string = 'INDICADORES';

  constructor() {
    super();
  }

  override loadList(): void {
    this.loading = true;
    this.catalogoService.get('CATALOGO_EMPLEABILIDAD', {tipo: this.tipo_catalogo}).subscribe( data =>{
      this.loading = false;
      this.listaItems = data.data;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["tipo_catalogo"] && changes["tipo_catalogo"].currentValue){
      this.tipo_catalogo = changes["tipo_catalogo"].currentValue;
      this.loadList();
    }
  }

  override conversion(): void {}
}