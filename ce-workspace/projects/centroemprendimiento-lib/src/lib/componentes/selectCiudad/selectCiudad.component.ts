import { Component, Input, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { SelectModel } from '../../modelos/SelectModel';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Dropdown } from 'primeng/dropdown';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selectCiudad',
  templateUrl: './selectCiudad.component.html',
  styleUrls: ['./selectCiudad.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCiudadComponent),
      multi: true
    }
  ],
  imports: [DropdownModule, FormsModule, ReactiveFormsModule, AutoCompleteModule, CommonModule]
})
export class SelectCiudadComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;
  @Input() pais: string | null = 'EC';
  @Input() provincia: string | null = '9';
  @Input() searchOnlyByCountry: boolean = false;
  @ViewChild('select') private select: Dropdown | undefined;

  constructor() {
    super();
  }

  override loadList(): void {
    this.loading = true;
    if(!this.searchOnlyByCountry){
      if(this.provincia){
        const params = {pais: this.pais, id_ubicacion_padre: this.provincia};
        this.consultarCiudades(params, 'CIUDAD');
      }
    }else{
      if(this.pais){
        const params = {pais: this.pais, ciudad: 'TODOS'};
        this.consultarCiudades(params, 'CIUDAD_PAIS');
      }
    }
    
  }

  consultarCiudades(params, catalogo){
    this.catalogoService.get(catalogo, params).subscribe( data =>{
      this.listaItems = data.data;
      this.loading = false;
      this.loadSelectItemInicial();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["pais"] && changes["pais"].currentValue){
      this.select?.clear();
      this.pais = changes["pais"].currentValue;
      this.listaItems = [];
      this.loadList();
    }
    if(changes["provincia"] && changes["provincia"].currentValue){
      this.select?.clear();
      this.provincia = changes["provincia"].currentValue;
      this.listaItems = [];
      this.loadList();
    }
  }

  filteredCity: any[] | undefined;
  filterCity(event: AutoCompleteCompleteEvent) {
    if(!this.pais){
      return;
    }
    const params = {pais: this.pais, ciudad: event.query};
    this.consultarCiudades(params, 'CIUDAD_PAIS');
  }
}
