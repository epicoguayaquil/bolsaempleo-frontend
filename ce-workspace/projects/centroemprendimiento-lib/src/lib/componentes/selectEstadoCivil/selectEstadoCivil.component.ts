import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { SelectModel } from '../../modelos/SelectModel';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectEstadoCivil',
  templateUrl: './selectEstadoCivil.component.html',
  styleUrls: ['./selectEstadoCivil.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectEstadoCivilComponent),
      multi: true
    }
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectEstadoCivilComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'ESTADO_CIVIL';

  constructor() {
    super();
  }

  override loadList(): void {}
}