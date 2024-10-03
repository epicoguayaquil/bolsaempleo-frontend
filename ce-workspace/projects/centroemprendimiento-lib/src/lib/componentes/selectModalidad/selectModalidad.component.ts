import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModel } from '../../modelos/SelectModel';

@Component({
  selector: 'app-selectModalidad',
  templateUrl: './selectModalidad.component.html',
  styleUrls: ['./selectModalidad.component.css'],
  standalone: true,
  imports: [DropdownModule, FormsModule, ReactiveFormsModule],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectModalidadComponent),
      multi: true,
    }
  ]
})
export class SelectModalidadComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'MODALIDAD';

  constructor() {
    super();
  }

  override loadList(): void {}
  
}