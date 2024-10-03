import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModel } from '../../modelos/SelectModel';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectRangoSalarial',
  templateUrl: './selectRangoSalarial.component.html',
  styleUrls: ['./selectRangoSalarial.component.css'],
  standalone: true,
  imports: [DropdownModule, FormsModule, ReactiveFormsModule],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectRangoSalarialComponent),
      multi: true,
    }
  ]
})
export class SelectRangoSalarialComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'RANGO_SALARIAL';

  constructor() {
    super();
  }

  override loadList(): void {}
  
}