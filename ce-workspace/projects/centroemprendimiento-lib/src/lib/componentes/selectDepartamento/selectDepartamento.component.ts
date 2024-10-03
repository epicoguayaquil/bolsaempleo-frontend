import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModel } from '../../modelos/SelectModel';
import { CatalogoService } from '../../servicios/Catalogo.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-selectDepartamento',
  templateUrl: './selectDepartamento.component.html',
  styleUrls: ['./selectDepartamento.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDepartamentoComponent),
      multi: true,
    },
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule]
})
export class SelectDepartamentoComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() id_institucion = 1;

  constructor() {
    super();
  }

  override loadList(): void {
    this.loading = true;
    this.catalogoService.get('INDICADORES_DEPARTAMENTO', {id_institucion: this.id_institucion}).subscribe( data =>{
      this.listaItems = data.data;
      this.loading = false;
    });
  }
}