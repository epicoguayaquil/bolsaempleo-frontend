import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModel } from '../../modelos/SelectModel';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectEtiqueta',
  templateUrl: './selectEtiqueta.component.html',
  styleUrls: ['./selectEtiqueta.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectEtiquetaComponent),
      multi: true
    }
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectEtiquetaComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() tipo_etiqueta: string = 'INTERES';

  constructor() {
    super();
  }

  override loadList(): void {
    this.loading = true;
    this.catalogoService.get('ETIQUETA', {tipo: this.tipo_etiqueta}).subscribe( data => {
      this.listaItems = data.data;
    })
  }
}