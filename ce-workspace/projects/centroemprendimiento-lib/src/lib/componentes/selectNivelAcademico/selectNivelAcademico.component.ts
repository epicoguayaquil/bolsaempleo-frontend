import { Component, Input, forwardRef } from '@angular/core';
import { SelectModel } from '../../modelos/SelectModel';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectNivelAcademico',
  templateUrl: './selectNivelAcademico.component.html',
  styleUrls: ['./selectNivelAcademico.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectNivelAcademicoComponent),
      multi: true
    }
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectNivelAcademicoComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'NIVEL_ACADEMICO';

  constructor() {
    super();
  }

  override loadList(): void {}
}