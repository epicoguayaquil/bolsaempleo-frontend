import { Component, Input, forwardRef } from '@angular/core';
import { SelectModel } from '../../modelos/SelectModel';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectGenero',
  templateUrl: './selectGenero.component.html',
  styleUrls: ['./selectGenero.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectGeneroComponent),
      multi: true
    }
  ], 
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectGeneroComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'GENERO';

  constructor() {
    super();
  }

  override loadList(): void {}
  
}