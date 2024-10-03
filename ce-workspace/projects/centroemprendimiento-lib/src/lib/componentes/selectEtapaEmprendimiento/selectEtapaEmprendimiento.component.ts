import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModel } from '../../modelos/SelectModel';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectEtapaEmprendimiento',
  templateUrl: './selectEtapaEmprendimiento.component.html',
  styleUrls: ['./selectEtapaEmprendimiento.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectEtapaEmprendimientoComponent),
      multi: true
    }
  ], 
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectEtapaEmprendimientoComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'ETAPA_EMPRENDIMIENTO';

  constructor() {
    super();
  }

  override loadList(): void {}
  
}
