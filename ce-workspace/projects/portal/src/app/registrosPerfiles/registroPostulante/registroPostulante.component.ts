import { Component, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { DatosPersonalesComponent } from '../componentes/datosPersonales/datosPersonales.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormacionAcademicaComponent } from '../componentes/formacionAcademica/formacionAcademica.component';
import { ExperienciaLaboralComponent } from '../componentes/experienciaLaboral/experienciaLaboral.component';
import { PostulanteService } from '../servicios/postulante.service';
import { HabilidadesComponent } from '../componentes/habilidades/habilidades.component';
import { ParametroRegistroPostulante } from '../interfaces/Parametros';
import { ExpectativaLaboralComponent } from '../componentes/expectativaLaboral/expectativaLaboral.component';
import { Postulante } from '../interfaces/Postulante';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CatalogoService, TerminosCondicionesComponent } from '../../../../../centroemprendimiento-lib/src/public-api';
import { LoginService } from '../../sesion/servicios/login.service';

@Component({
  selector: 'app-registroPostulante',
  templateUrl: './registroPostulante.component.html',
  styleUrls: ['./registroPostulante.component.css'],
  standalone: true,
  imports: [StepperModule, DatosPersonalesComponent, ButtonModule, CommonModule, 
    FormsModule, ReactiveFormsModule, FormacionAcademicaComponent, ExperienciaLaboralComponent,
  TerminosCondicionesComponent, HabilidadesComponent, ExpectativaLaboralComponent, ConfirmDialogModule]
})
export class RegistroPostulanteComponent implements OnInit {

  public submited: boolean = false;
  public datosPersonales:any = {};
  public formacionAcademica:any={};
  public experienciaLaboral:any={};
  public terminosCondiciones:any={};
  public habilidades:any={};
  public expectativaLaboral:any={};

  public deshabilitarDatosPersonales:boolean = false;
  public fieldsToDisableDatosPersonales:any = ['tipo_identificacion','identificacion','email'];

  identificacion:string = '';
  private postulanteService:PostulanteService = inject(PostulanteService);
  private catalogoService: CatalogoService = inject(CatalogoService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService:MessageService = inject(MessageService);
  private loginServicio:LoginService = inject(LoginService);

  @ViewChild('terminosCondicionesComp') private terminosCondicionesComponent?: TerminosCondicionesComponent;

  loading:boolean = false;
  deshabilitar:boolean = false;
  listaEtiquetas:any[]=[];

  @Output() registrado = new EventEmitter<boolean>();

  ngOnInit() {
    this.catalogoService.get('ETIQUETA', {tipo: 'EMPLEABILIDAD'}).subscribe( data => {
      this.listaEtiquetas = data.data;
    });
    this.loginServicio.getToken().then(token =>{
      if(token){
        this.consultarPostulanteUsuario();
      }
    });
  }

  identificadorCambios(): void {
    if(this.datosPersonales && this.datosPersonales.identificacion){
      if(this.identificacion != this.datosPersonales.identificacion){
        this.identificacion = this.datosPersonales.identificacion;
        this.consultarPostulante();
      }
    }
  }

  guardar(){
    this.loading = true;
    this.submited = true;
    console.log('Registrar: ', {
      datosPersonales: this.datosPersonales,
      formacionAcademica: this.formacionAcademica,
      experienciaLaboral: this.experienciaLaboral,
      terminosCondiciones: this.terminosCondiciones,
      habilidades: this.habilidades
    });

    let params: ParametroRegistroPostulante = {
      persona: {
        ...this.datosPersonales,
        redes_sociales: this.formacionAcademica.redes_sociales,
        id_nivel_academico: this.formacionAcademica.id_nivel_academico,
        id_situacion_laboral: this.formacionAcademica.id_situacion_laboral,
        file_cv_base64: this.formacionAcademica.file_cv_base64,
        uso_datos: this.terminosCondiciones.uso_datos,
        terminos_condiciones: this.terminosCondiciones
      },

      postulante:{
        ...this.expectativaLaboral,
        has_experiencia: this.experienciaLaboral.has_experiencia,
        perfil: this.formacionAcademica.descripcion_perfil,
        id_persona: this.datosPersonales.id_persona,
        is_estudiante: this.formacionAcademica.is_estudiante,
        is_trabajando: this.experienciaLaboral.is_trabajando,
        otras_habilidades: this.habilidades.otras_habilidades?.join(';'),
        
        titulos_academicos: this.formacionAcademica.titulos_academicos,
        experiencias_laborales: [this.experienciaLaboral],
        habilidades: this.habilidades.habilidades
      }
    }
    console.log('Grabar:', params);
    this.postulanteService.createPostulante(params).subscribe( {
      next: (data) =>{
        this.loading = false;
        if(data.codigo == '1'){
          this.consultarPerfil();
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
              this.registrado.emit(true);
            }
          });
        }
      },
      error: (response) => {
        this.loading = false;
      }
    });
  }

  siguiente(nextCallback, component: DatosPersonalesComponent | FormacionAcademicaComponent | ExperienciaLaboralComponent | HabilidadesComponent){
    if(component.isValid(true)){
      nextCallback.emit();
    }
  }

  consultarPostulante(){
    this.loading = true;
    this.postulanteService.getPostulante(this.identificacion).subscribe({
      next: (data) => {
        this.cargarDatosPostulante(data.data);
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
      },
    });
  }

  consultarPostulanteUsuario(){
    this.loading = true;
    this.postulanteService.getPostulanteUsuario().subscribe({
      next: (data) => {
        this.cargarDatosPostulante(data.data);
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
      },
    });
  }

  cargarDatosPostulante(data){
    if(data && data.persona){
      //this.deshabilitarDatosPersonales = true;
      this.datosPersonales = data.persona;
      if(data.persona.id_persona || data.persona.id){
        this.deshabilitarDatosPersonales = true;
        this.fieldsToDisableDatosPersonales = ['tipo_identificacion','identificacion','email'];
      }
      const postulante:Postulante = data.postulante || {};
      const { id_postulante, id_rango_salarial, id_modalidad, titulos_academicos, perfil, 
        experiencias_laborales, habilidades, otras_habilidades, observacion, id_usuario } = postulante;

      this.formacionAcademica = {redes_sociales: data.persona?.redes_sociales, 
        id_situacion_laboral: data.persona?.id_situacion_laboral,
        id_nivel_academico: data.persona?.id_nivel_academico,
        descripcion_perfil: perfil,
        titulos_academicos: titulos_academicos
      };
      let experienca_laboral = (experiencias_laborales && experiencias_laborales.length > 0) ? experiencias_laborales[0] : {};
      experienca_laboral.has_experiencia = (experiencias_laborales && experiencias_laborales.length > 0);
      this.experienciaLaboral = experienca_laboral;
      this.terminosCondiciones = {uso_datos: data.persona?.uso_datos};

      this.expectativaLaboral = { id_postulante, id_rango_salarial, id_modalidad, observacion, id_usuario };

      this.habilidades = {};
      this.habilidades.habilidades = habilidades ? habilidades : [];
      this.habilidades.otras_habilidades = otras_habilidades?.split(';');
      if(id_usuario){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ya te encuentras registrado'});
        this.deshabilitar = true;
        this.fieldsToDisableDatosPersonales = null;
      }
    }
  }

  consultarPerfil(){
    console.log('Inicio consultarPerfil');
    this.loginServicio.getToken().then((token) => {
      debugger;
      console.log('consultarPerfil: Token: ', token);
      if(token){
        this.loginServicio.consultarParametrosPerfil('POSTULANTE').subscribe();
      }
    })
  }

  getIsAprobadoGrabar(){
    if(!this.terminosCondicionesComponent){
      return false;
    }
    return this.terminosCondicionesComponent.isValid(this.submited);
  }
}
