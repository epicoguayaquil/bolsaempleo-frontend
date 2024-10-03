import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModel } from '../../modelos/SelectModel';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectCatalogoEmpleabilidad',
  templateUrl: './selectCatalogoEmpleabilidad.component.html',
  styleUrls: ['./selectCatalogoEmpleabilidad.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCatalogoEmpleabilidadComponent),
      multi: true
    }
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectCatalogoEmpleabilidadComponent extends SelectModel {
  
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
}
