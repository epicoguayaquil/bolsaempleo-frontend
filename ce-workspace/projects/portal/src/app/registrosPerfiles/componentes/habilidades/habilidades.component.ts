import { Component, Input, OnInit, forwardRef, inject } from '@angular/core';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListboxModule } from 'primeng/listbox'
import { AccordionModule } from 'primeng/accordion';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { ChipsModule } from 'primeng/chips';
import { CatalogoService, ComponentForm, organizarEtiquetas } from '../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-habilidades',
  templateUrl: './habilidades.component.html',
  styleUrls: ['./habilidades.component.css'],
  standalone: true,
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HabilidadesComponent),
      multi: true,
    }
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ListboxModule,
    AccordionModule, InputIconModule, IconFieldModule, SkeletonModule, CardModule,
    ChipsModule
  ]
})
export class HabilidadesComponent extends ComponentForm implements OnInit {

  @Input() override submited: boolean = false;
  @Input() listaEtiquetas?:any[];

  listaGrupoHabilidades?:any[];
  listaPerfiles?:any[];
  loading:boolean = false;

  override formDatos: FormGroup<any> =  this.formBuilder.group({
    'perfiles': [null],
    'otras_habilidades': [null]
  });

  private catalogoService: CatalogoService = inject(CatalogoService);

  constructor() { 
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    if(!this.listaEtiquetas){
      this.loading = true;
      this.catalogoService.get('ETIQUETA', {tipo: 'EMPLEABILIDAD'}).subscribe( data => {
        this.listaEtiquetas = organizarEtiquetas(data.data);
        let Perfiles = this.listaEtiquetas.find(element => element.nombre == 'PERFIL');
        this.listaGrupoHabilidades = this.listaEtiquetas.filter(ele => ele.nombre != 'PERFIL');
        this.listaPerfiles = Perfiles.lista;
        this.agregarFormsControls();
        this.loading = false;
      });
    }else{
      this.listaEtiquetas = organizarEtiquetas(this.listaEtiquetas);
      let Perfiles = this.listaEtiquetas.find(element => element.nombre == 'PERFIL');
      this.listaGrupoHabilidades = this.listaEtiquetas.filter(ele => ele.nombre != 'PERFIL');
      this.listaPerfiles = Perfiles.lista;
      this.agregarFormsControls();
    }
  }

  agregarFormsControls(){
    this.listaGrupoHabilidades?.forEach((grupo, index)=>{
      this.formDatos.addControl('habilidad-'+index, this.formBuilder.control(null) );
    });
    this.setValues(this.getValueInicial());
  }

  override getValues() {
    const values = { ...this.formDatos.value };
    let etiquetasSeleccionadas:any[] = [];
    for (const key in values) {
      if(key != 'otras_habilidades' && values[key]){
        etiquetasSeleccionadas = [...etiquetasSeleccionadas, ...values[key]];
      }
      //if (objeto.hasOwnProperty(key)) {
        //console.log(`${key}: ${objeto[key]}`);
      //}
    }
    return {otras_habilidades: values.otras_habilidades, habilidades: etiquetasSeleccionadas};
  }

  override setValues(values: any): void {
    if(values){
      if(values.otras_habilidades){
        if(typeof values.otras_habilidades == 'string'){
          this.formDatos.controls['otras_habilidades'].setValue(values.otras_habilidades.split(','));
        }else{
          this.formDatos.controls['otras_habilidades'].setValue(values.otras_habilidades);
        }
      }
      if(values.habilidades && values.habilidades.length > 0 && this.listaGrupoHabilidades){
        let habilidadesSeleccionadas = [...values.habilidades];
        if(typeof values.habilidades[0] == 'object'){
          if(values.habilidades[0]['sub_tipo']){
            this.listaGrupoHabilidades.forEach((grupo, index) =>{
              let grupoEtiquetasSeleccionadas = habilidadesSeleccionadas.filter(element => element.sub_tipo == grupo.nombre);
              this.formDatos.controls['habilidad-'+index].setValue(grupoEtiquetasSeleccionadas);
            });
          }else{
            let listaGruposEtiquetasSeleccionadas:any[] = [];
            habilidadesSeleccionadas.forEach(etiqueta => {
              const etiquetaObj = this.listaEtiquetas?.find(element => element.id == etiqueta.id_etiqueta || element.id == etiqueta.id);
              if(etiquetaObj){
                let grupo:any = listaGruposEtiquetasSeleccionadas.find(element => element.nombre == etiquetaObj.sub_tipo);
                if(!grupo){
                  grupo = {nombre: etiquetaObj.sub_tipo, lista: []};
                  listaGruposEtiquetasSeleccionadas.push(grupo);
                }
                grupo.lista.push(etiquetaObj);
              }
            });
            if( listaGruposEtiquetasSeleccionadas.length >0 ){
              this.listaGrupoHabilidades.forEach((grupo, index) => {
                const grupoSeleccionado = listaGruposEtiquetasSeleccionadas.find(element => element.nombre == grupo.nombre);
                this.formDatos.controls['habilidad-'+index].setValue(grupoSeleccionado);
              });
            }
          }
        }else{
          let listaGruposEtiquetasSeleccionadas:any[] = [];
          habilidadesSeleccionadas.forEach(etiqueta => {
            const etiquetaObj = this.listaEtiquetas?.find(element => element.id == etiqueta);
            if(etiquetaObj){
              let grupo:any = listaGruposEtiquetasSeleccionadas.find(element => element.nombre == etiquetaObj.sub_tipo);
              if(!grupo){
                grupo = {nombre: etiquetaObj.sub_tipo, lista: []};
                listaGruposEtiquetasSeleccionadas.push(grupo);
              }
              grupo.lista.push(etiquetaObj);
            }
          });
          if( listaGruposEtiquetasSeleccionadas.length >0 ){
            this.listaGrupoHabilidades.forEach((grupo, index) => {
              const grupoSeleccionado = listaGruposEtiquetasSeleccionadas.find((element:any) => element.nombre == grupo.nombre);
              this.formDatos.controls['habilidad-'+index].setValue(grupoSeleccionado);
            });
          }
        }
      }

      if(values.habilidades && values.habilidades.length > 0 && this.listaPerfiles){
        let habilidadesSeleccionadas = [...values.habilidades];
        if(typeof values.habilidades[0] == 'object'){
          if(values.habilidades[0]['sub_tipo']){
            let grupoEtiquetasSeleccionadas = habilidadesSeleccionadas.filter(element => element.sub_tipo == 'PERFIL');
            this.formDatos.controls['perfiles'].setValue(grupoEtiquetasSeleccionadas);
          }else{
            let grupoEtiquetasSeleccionadas:any[] = [];
            habilidadesSeleccionadas.forEach(etiqueta => {
              const etiquetaObj = this.listaEtiquetas?.find(element => element.id == etiqueta.id_etiqueta || element.id == etiqueta.id);
              grupoEtiquetasSeleccionadas.push(etiquetaObj);
            });
            this.formDatos.controls['perfiles'].setValue(grupoEtiquetasSeleccionadas);
          }
        }else{
          let grupoEtiquetasSeleccionadas:any[] = [];
          habilidadesSeleccionadas.forEach(etiqueta => {
            const etiquetaObj:any = this.listaEtiquetas?.find(element => element.id == etiqueta);
            grupoEtiquetasSeleccionadas.push(etiquetaObj);
          });
          this.formDatos.controls['perfiles'].setValue(grupoEtiquetasSeleccionadas);
        }
      }
    }
  }

}