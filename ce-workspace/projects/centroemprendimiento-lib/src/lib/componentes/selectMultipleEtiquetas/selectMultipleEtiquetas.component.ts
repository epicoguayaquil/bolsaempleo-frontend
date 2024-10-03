import { Component, EventEmitter, forwardRef, Input, Output, SimpleChanges } from '@angular/core';
import { organizarEtiquetas } from '../../interfaces/Etiquetas';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectMultipleModel } from '../../modelos/SelectMultipleModel';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-selectMultipleEtiquetas',
  templateUrl: './selectMultipleEtiquetas.component.html',
  styleUrls: ['./selectMultipleEtiquetas.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleEtiquetasComponent),
      multi: true
    }
  ],
  imports: [CommonModule, MultiSelectModule, FormsModule, ReactiveFormsModule]
})
export class SelectMultipleEtiquetasComponent extends SelectMultipleModel {
  
  
  @Input() override returnId: boolean = true;
  @Input() numeroEstapaciosDisponibles:number = 4;
  @Input() tipo_etiqueta: string = 'INTERES';
  @Input() visible?: boolean = true;
  @Input() style:any;

  @Output() numero_campos = new EventEmitter<number>();

  claseColum:string = 'col-12 sm:col-12 md:col-4 lg:col-4 xl:col-4';
  listaItemsEstructurada:any[]=[];

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['numeroEstapaciosDisponibles'] && changes['numeroEstapaciosDisponibles'].currentValue){
      this.numeroEstapaciosDisponibles = changes['numeroEstapaciosDisponibles'].currentValue;
      this.calcularColumn();
    }
  }

  override loadList(): void {
    this.catalogoService.get('ETIQUETA', {tipo: this.tipo_etiqueta}).subscribe( data => {
      this.listaItems = data.data;
      this.numero_campos.emit(this.listaItems.length);
      this.conversion();
      this.calcularColumn();
    })
  }

  override conversion(): void {
    this.listaItemsEstructurada = organizarEtiquetas(this.listaItems);
  }

  override getItemSelected(){
    if(!this.listaItemsEstructurada){
        return null;
    }
    let lista:any[] = [];
    if(!this.returnId){
      this.listaItemsEstructurada.forEach(grupo =>{
        lista = [...lista, ...grupo.listaSeleccionada];
      });
    }else{
      this.listaItemsEstructurada.forEach(grupo =>{
        lista = [...lista, ...grupo.listaSeleccionada.map(objeto => objeto[this.fieldIdName])];
      });
    }
    this._selectItems = lista;
    return lista;
  }

  registrarCambio(){
    setTimeout(() => {
      this.onChange(this.getItemSelected());
      this.onTouched();
    });
  }

  protected override loadSelectItem(val?: any): void {
    let lista = [];
    let _selectItems = val ? val : this._selectItems;
    if(_selectItems){
      lista = typeof _selectItems == 'string' ? _selectItems.split(',') : _selectItems;
      if(lista.length > 0){
        lista.forEach(item =>{
          let id = typeof item === 'object' ? item[this.fieldIdName] : item;
          this.listaItemsEstructurada.forEach(grupo =>{
            let element = grupo.lista.find(ele => ele[this.fieldIdName] == id);
            grupo.listaSeleccionada.push(element);
          });
        });
      }
    }
    if (JSON.stringify(lista) !== JSON.stringify(this.getItemSelected())) {
      this.onChange(this.getItemSelected());
    }
  }

  calcularColumn(){
    let clase = 'col-12 sm:col-12'; // md:col-4 lg:col-4 xl:col-4
    switch(this.numeroEstapaciosDisponibles){
      case 1: clase += ' md:col-12 lg:col-12 xl:col-12'; break;
      case 2: clase += ' md:col-6 lg:col-6 xl:col-6'; break;
      case 3: clase += ' md:col-4 lg:col-4 xl:col-4'; break;
      case 4: clase += ' md:col-3 lg:col-3 xl:col-3'; break;
      default: clase += ' md:col-4 lg:col-4 xl:col-4'; break;
    }
    this.claseColum = clase;
  }
}