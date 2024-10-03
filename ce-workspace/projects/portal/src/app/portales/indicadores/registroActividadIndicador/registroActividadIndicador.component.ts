import { Component, inject } from '@angular/core';
import { SeguimientoIndicadorService } from '../../servicios/SeguimientoIndicador.service';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { FormMensageErrorComponent, Registrar, SelectCatalogoEmpleabilidadComponent, SelectCatalogoEmpleabilidadMultipleComponent, SelectDepartamentoComponent, SelectEmpresasAliadasComponent, SelectProgramaIndicadorComponent, SelectSubProgramaComponent } from '../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-registroActividadIndicador',
  templateUrl: './registroActividadIndicador.component.html',
  styleUrls: ['./registroActividadIndicador.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, FormMensageErrorComponent, 
    SelectCatalogoEmpleabilidadComponent, SelectProgramaIndicadorComponent,
    SelectSubProgramaComponent, SelectEmpresasAliadasComponent, SelectDepartamentoComponent, ButtonModule,
    InputNumberModule, InputTextModule, InputMaskModule, InputTextareaModule, SelectCatalogoEmpleabilidadMultipleComponent]
})
export class RegistroActividadIndicadorComponent extends Registrar {

  private seguimientoIndicadorService = inject(SeguimientoIndicadorService);

  override formDatos =  this.formBuilder.group({
    'id_indicador': [null, Validators.compose([Validators.required])],
    'id_programa': [null, Validators.compose([Validators.required])],
    'id_sub_programa': [null],
    'actividad': [null, Validators.compose([Validators.required])],
    'id_empresa_aliada': [1],
    'fecha': [null, Validators.compose([Validators.required])],
    'observacion': [null],
    'registrados': [null],
    'asistentes': [null],
    'recursos_empresa': [null],
    'recursos_epico': [null],
    'estado': ['A'],
    'id_departamento': [null, Validators.compose([Validators.required])],
    'ejes': [null]
  });

  override insertRequest(registro: any) {
    registro.ejes = registro.ejes ? registro.ejes.map((item:any)=>{return item.id}) : [];
    registro.estado = 'A';
    this.seguimientoIndicadorService.crearIndicador(registro).subscribe(data => {
      if(data.codigo == '1'){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registrado con exito' });
        this.saved.emit(registro);
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: data.mensaje });
        this.error.emit(1);
      }
    });
  }

  override updateRequest(registro: any) {
    registro.ejes = registro.ejes ? registro.ejes.map((item:any)=>{return item.id}) : [];
    registro.estado = 'A';
    this.seguimientoIndicadorService.actualizarIndicador(registro, registro.id).subscribe(data => {
      if(data.codigo == '1'){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Actualizado con exito' });
        this.saved.emit(registro);
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: data.mensaje });
        this.error.emit(1);
      }
    });
  }

}
