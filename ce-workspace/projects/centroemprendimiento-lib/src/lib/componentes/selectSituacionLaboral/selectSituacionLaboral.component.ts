import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModel } from '../../modelos/SelectModel';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectSituacionLaboral',
  templateUrl: './selectSituacionLaboral.component.html',
  styleUrls: ['./selectSituacionLaboral.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSituacionLaboralComponent),
      multi: true
    }
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectSituacionLaboralComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'SITUACION_LABORAL';

  constructor() {
    super();
  }

  override loadList(): void {}
}