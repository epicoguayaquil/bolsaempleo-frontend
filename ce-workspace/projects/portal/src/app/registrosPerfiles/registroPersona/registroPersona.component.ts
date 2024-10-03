import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { DatosPersonales, DatosPersonalesComponent } from '../componentes/datosPersonales/datosPersonales.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ListboxModule } from 'primeng/listbox';
import { SkeletonModule } from 'primeng/skeleton';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { Persona } from '../interfaces/Persona';
import { PersonaService } from '../servicios/Persona.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CatalogoService, FormMensageErrorComponent, General, TerminosCondicionesComponent } from '../../../../../centroemprendimiento-lib/src/public-api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-registroPersona',
  templateUrl: './registroPersona.component.html',
  styleUrls: ['./registroPersona.component.css'],
  standalone: true,
  imports: [DatosPersonalesComponent, FormsModule, ReactiveFormsModule, CardModule, ButtonModule,
    TerminosCondicionesComponent, ListboxModule, SkeletonModule, MultiSelectModule, CommonModule,
    CheckboxModule, FormMensageErrorComponent, ConfirmDialogModule
  ]
})
export class RegistroPersonaComponent implements OnInit {

  public datosPersonales:any = {};
  public interesesSeleccionados:Array<any> = [];
  public submited: boolean = false;
  public listaInteres:Array<any> = [];
  loading:boolean = false;
  loadingRegistro:boolean = false;
  identificacion:string = '';
  public deshabilitarDatosPersonales:boolean = false;
  public terminosCondiciones:any={};

  requiredFields:Array<string> = []; //['tipo_identificacion', 'identificacion'];
  visibleFields:Array<string> = [];//['tipo_identificacion', 'identificacion']
  public fieldsToDisableDatosPersonales:any = ['tipo_identificacion','identificacion','email'];
  
  @ViewChild('datosPersonalesComponent') private datosPersonalesComponent?: DatosPersonalesComponent;
  @ViewChild('terminosCondicionesComp') private terminosCondicionesComponent?: TerminosCondicionesComponent;
  public persona?:Persona;
  @Output() registrado = new EventEmitter<boolean>();

  private personaService:PersonaService = inject(PersonaService);
  protected formBuilder: FormBuilder = inject(FormBuilder);
  private catalogoService:CatalogoService = inject(CatalogoService);
  private messageService:MessageService = inject(MessageService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private tipo_etiqueta = 'SERVICIOS_EPICO';

  formDatos =  this.formBuilder.group({
    'intereses': [null, [Validators.required]]
  });

  ngOnInit() {
    this.catalogoService.get('ETIQUETA', {tipo: this.tipo_etiqueta}).subscribe(data => {
      this.listaInteres = data.data;
    });
  }

  identificadorCambios(): void {
    console.log('Datos: ', this.datosPersonales, this.datosPersonales?.identificacion, this.identificacion)
    if(this.datosPersonales && this.datosPersonales.identificacion){
      if(this.identificacion != this.datosPersonales.identificacion){
        this.identificacion = this.datosPersonales.identificacion;
        this.consultaPersona();
      }
    }
  }

  consultaPersona(){
    this.loading = true;
    this.personaService.getPersona(this.identificacion).subscribe({
      next: (data) => {
        if(data.data){
          this.persona = data.data;
          this.persona.id_persona = this.persona.id_persona ? this.persona.id_persona : this.persona.id;
          if(this.persona.id_persona){
            this.consultaEtiquetasPersona();
            this.deshabilitarDatosPersonales = true;
            this.fieldsToDisableDatosPersonales = ['tipo_identificacion','identificacion','email'];
          }else{
            this.fieldsToDisableDatosPersonales = null;
          }
          let id_provincia = data.data.ciudad.id_ubicacion_padre
          this.datosPersonales = {...data.data, id_provincia: id_provincia };
        }
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
      },
    });
  }

  consultaEtiquetasPersona(){
    if(this.persona?.id_persona){
      this.personaService.getEtiqueta(this.persona.id_persona, this.tipo_etiqueta).subscribe(data => {
        this.interesesSeleccionados = data.data;
      });
    }
  }

  fieldIsValid (nameField) {
    return General.fieldIsValid(this.formDatos.controls[nameField], this.submited);
  }

  grabar(){
    this.loadingRegistro = true;
    this.submited = true;
    if(!this.datosPersonalesComponent?.isValid(true) || this.formDatos.invalid){
      this.loadingRegistro = false;
      return;
    }

    const ids = this.interesesSeleccionados.map(objeto => objeto.id);
    let persona:Persona = {...this.persona, ...this.datosPersonales, ...this.terminosCondiciones, intereses_servicios_epico: ids};


    this.personaService.createUsuarioPerfilDefault(persona).subscribe({
      next: (data) => {
        this.loadingRegistro = false;
        if(this.persona){
          this.persona.id = data.data;
          this.persona.id_persona = data.data;
        }
        console.log('Registro exitoso: ', data);
        this.confirmationService.confirm({
          target: event?.target as EventTarget,
          message: data.mensaje,
          header: 'Excelente',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon:"none",
          rejectIcon:"none",
          rejectVisible: false,
          rejectButtonStyleClass:"p-button-text",
          acceptLabel:'Aceptar',
          accept: () => {
            console.log('Registro exitoso emitido registrado: ', data);
            this.registrado.emit(true);
          }
        });

        this.messageService.add({ severity: 'success', summary: 'Success', detail: data.mensaje });
        this.clear();
      },
      error: (response) => {
        console.log('Error: ', response);
        this.loadingRegistro = false;
      },
    });
    
  }

  clear(){
    this.datosPersonalesComponent?.clear();
    this.terminosCondicionesComponent?.clear();
    this.formDatos.reset();
    this.deshabilitarDatosPersonales = false;
    this.datosPersonales = undefined;
    this.persona = undefined;
    this.terminosCondiciones = {};
    this.interesesSeleccionados = [];
    this.submited = false;
    this.identificacion = '';
  }

  getIsAprobadoGrabar(){
    if(!this.terminosCondicionesComponent){
      return false;
    }
    return this.terminosCondicionesComponent.isValid(this.submited);
  }
}
