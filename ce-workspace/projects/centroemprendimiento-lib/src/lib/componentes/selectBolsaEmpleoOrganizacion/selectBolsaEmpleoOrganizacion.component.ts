import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModel } from '../../modelos/SelectModel';

@Component({
  selector: 'app-selectBolsaEmpleoOrganizacion',
  templateUrl: './selectBolsaEmpleoOrganizacion.component.html',
  styleUrls: ['./selectBolsaEmpleoOrganizacion.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBolsaEmpleoOrganizacionComponent),
      multi: true,
    },
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]

})
export class SelectBolsaEmpleoOrganizacionComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() style:any;

  override nemonicoCatalogo = 'ORGANIZACIONES';

  constructor() {
    super();
  }

  override loadList(): void {}
}