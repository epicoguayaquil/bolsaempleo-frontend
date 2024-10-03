import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModel } from '../../modelos/SelectModel';

@Component({
  selector: 'app-selectTipoEmprendimiento',
  templateUrl: './selectTipoEmprendimiento.component.html',
  styleUrls: ['./selectTipoEmprendimiento.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectTipoEmprendimientoComponent),
      multi: true
    }
  ], 
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectTipoEmprendimientoComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'TIPO_EMPRENDIMIENTO';

  constructor() {
    super();
  }

  override loadList(): void {}
  
}
