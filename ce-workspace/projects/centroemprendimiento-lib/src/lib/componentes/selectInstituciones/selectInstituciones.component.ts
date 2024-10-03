import { Component, Input, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModel } from '../../modelos/SelectModel';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectInstituciones',
  templateUrl: './selectInstituciones.component.html',
  styleUrls: ['./selectInstituciones.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectInstitucionesComponent),
      multi: true,
    },
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectInstitucionesComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() style:any;

  constructor() {
    super();
  }

  override loadList(): void {
    this.loading = true;
    this.catalogoService.get('INSTITUCIONES').subscribe( data =>{
      this.listaItems = data.data;
      this.loading = false;
    });
  }
}
