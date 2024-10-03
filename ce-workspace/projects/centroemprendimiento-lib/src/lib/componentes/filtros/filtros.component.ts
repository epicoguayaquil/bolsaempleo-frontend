import { Component, EventEmitter, HostBinding, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ParametrosFiltro, ParametrosOptions, defaultOptionParametros } from '../../interfaces/Parametros';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ImageModule } from 'primeng/image';
import { CalendarModule } from 'primeng/calendar';
import { SelectMultipleEtiquetasComponent } from '../selectMultipleEtiquetas/selectMultipleEtiquetas.component';
import { SelectInstitucionesComponent } from '../selectInstituciones/selectInstituciones.component';
import { SelectBolsaEmpleoOrganizacionComponent } from '../selectBolsaEmpleoOrganizacion/selectBolsaEmpleoOrganizacion.component';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FiltrosComponent),
      multi: true,
    },
  ],
  imports:[CommonModule, FieldsetModule, ButtonModule,  FloatLabelModule, ImageModule, 
    CalendarModule, SelectMultipleEtiquetasComponent, SelectInstitucionesComponent,
    FormsModule, ReactiveFormsModule, SelectBolsaEmpleoOrganizacionComponent
  ]
})
export class FiltrosComponent implements OnInit, ControlValueAccessor {

  _institucion: any;
  _orgaizacion: any;
  _fecha_desde: any;
  _fecha_hasta: any;
  _etiquetas:any;
  claseColumnEtiqueta?: string;
  numeroEtiquetas:number = -1;
  numeroEstapaciosDisponibles:number = 4;
  
  @Input() className: string = '';
  @Input() options:ParametrosOptions | undefined;
  @Input() loading: boolean = false;
  @Output() search = new EventEmitter<any>();

  protected optionsConfig: ParametrosOptions = defaultOptionParametros;

  params:ParametrosFiltro = {};
  protected isDisabled: boolean = false;

  constructor() { }

  ngOnInit() {
    this.optionsConfig = { ...defaultOptionParametros, ...this.options };    
    this.calcularClaseEtiqueta();
  }

  calcularClaseEtiqueta(){
    let clase = 'col-12 sm:col-12';
    let contador = -1;
    Object.entries(this.optionsConfig).forEach(([key, value])=>{
      if(value===true){contador++;}
    });
    let residuo = contador%3;
    switch(residuo){
      case 1: clase += ' md:col-9 lg:col-9 xl:col-9'; break
      case 2: clase += ' md:col-6 lg:col-6 xl:col-6'; break
      case 3: clase += ' md:col-12 lg:col-12 xl:col-12'; break
      default: clase += ' md:col-12 lg:col-12 xl:col-12'; break
    }
    this.numeroEstapaciosDisponibles = (residuo === 0) ? 4 : (4 - residuo);
    this.claseColumnEtiqueta = clase;
  }

  onChange: any = () => {}; // Funcion a ser llamada cuando el valor cambia
  onTouched: any = () => {}; // Funcion a ser llamada cuando el control es tocado

  writeValue(obj: any): void {
    this.params = obj;
    this.setParametros();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setParametros(){
    if(!this.params){
      this.params = {};
      return;
    }
    this.institucion = this.params.id_institucion;
  }

  get institucion() {
    return this._institucion;
  }

  set institucion(val: any) {
    this._institucion = val;
    this.params.id_institucion = this._institucion;
    this.onChange(this.params);
  }

  get organizacion() {
    return this._orgaizacion;
  }

  set organizacion(val: any) {
    this._orgaizacion = val;
    this.params.id_organizacion = this._orgaizacion;
    this.onChange(this.params);
  }

  get fecha_desde() {
    return this._fecha_desde;
  }

  set fecha_desde(val: any) {
    this._fecha_desde = val;
    this.params.fecha_desde = this._fecha_desde;
    this.onChange(this.params);
  }

  get fecha_hasta() {
    return this._fecha_hasta;
  }

  set fecha_hasta(val: any) {
    this._fecha_hasta = val;
    this.params.fecha_hasta = this._fecha_hasta;
    this.onChange(this.params);
  }

  get etiquetas() {
    return this._etiquetas;
  }

  set etiquetas(val: any) {
    this._etiquetas = val;
    this.params.etiquetas = this._etiquetas;
    this.onChange(this.params);
  }

  @HostBinding('class') get getClasses() {
    //return this.className; // Retorna la cadena de clases para aplicarla al elemento raíz
    return "";
  }

  load() {
    this.loading = true;
    this.search.emit(true);
  }
}
