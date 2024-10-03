import { Component, forwardRef, Input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectMultipleModel } from '../../modelos/SelectMultipleModel';
import { General, OptionArbolTipo } from '../../modelos/General';

@Component({
  selector: 'app-selectMultipleTipoFinanciamiento',
  templateUrl: './selectMultipleTipoFinanciamiento.component.html',
  styleUrls: ['./selectMultipleTipoFinanciamiento.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleTipoFinanciamientoComponent),
      multi: true
    }
  ],
  imports: [MultiSelectModule, FormsModule, ReactiveFormsModule]
})
export class SelectMultipleTipoFinanciamientoComponent extends SelectMultipleModel {
  
  
  @Input() override returnId: boolean = true;
  override nemonicoCatalogo = 'TIPO_FINANCIAMIENTO';
  listaItemsEstructurada:any[]=[];

  constructor() {
    super();
  }

  override loadList(): void {
    
  }

  override conversion(): void {
    const options: OptionArbolTipo = {
      attrValuesChild: ['id','nombre'],
      attrNamesChild: ['value','label'],
      attrChild: 'items',
      attrNameParent: ['value','label'],
      attrValuesParent: ['tipo','tipo'],
      attrTipo:'tipo'
    }
    this.listaItemsEstructurada = General.armarArbolTipo(this.listaItems, options);
  } 
}