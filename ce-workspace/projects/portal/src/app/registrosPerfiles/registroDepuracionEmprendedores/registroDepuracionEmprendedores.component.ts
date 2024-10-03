import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { DatosPersonalesComponent } from '../componentes/datosPersonales/datosPersonales.component';
import { EmprendimientosComponent } from '../componentes/emprendimientos/emprendimientos.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { TerminosCondicionesComponent } from '../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-registroDepuracionEmprendedores',
  templateUrl: './registroDepuracionEmprendedores.component.html',
  styleUrls: ['./registroDepuracionEmprendedores.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, StepperModule, ButtonModule, CardModule,
    DatosPersonalesComponent, TerminosCondicionesComponent, EmprendimientosComponent, ConfirmDialogModule]
})
export class RegistroDepuracionEmprendedoresComponent implements OnInit {

  public datosPersonales:any = {};
  public terminosCondiciones:any={};
  public emprendimientos:any={};

  public submited: boolean = false;
  public deshabilitarDatosPersonales:boolean = false;
  public fieldsToDisableDatosPersonales = ['tipo_identificacion','identificacion'];
  public loading:boolean = false;
  public deshabilitar:boolean = false;
  public identificacion:string = '';

  private messageService:MessageService = inject(MessageService);

  constructor() { }

  ngOnInit() {
  }

  siguiente(nextCallback, component: DatosPersonalesComponent | EmprendimientosComponent){
    if(component.isValid(true)){
      nextCallback.emit();
    }
  }

  identificadorCambios(): void {
    if(this.datosPersonales && this.datosPersonales.identificacion){
      if(this.identificacion != this.datosPersonales.identificacion){
        this.identificacion = this.datosPersonales.identificacion;
        this.consultarEmprendedor();
      }
    }
  }

  consultarEmprendedor(){

  }

  guardar(){

  }
}
