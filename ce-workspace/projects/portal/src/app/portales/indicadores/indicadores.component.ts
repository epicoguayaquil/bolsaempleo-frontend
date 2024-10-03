import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeguimientoIndicadorService } from '../servicios/SeguimientoIndicador.service';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RegistroActividadIndicadorComponent } from './registroActividadIndicador/registroActividadIndicador.component';
import { ColumnView, FormMensageErrorComponent, SelectCatalogoEmpleabilidadComponent, SelectCatalogoEmpleabilidadMultipleComponent, SelectDepartamentoComponent, SelectEmpresasAliadasComponent, SelectProgramaIndicadorComponent, SelectSubProgramaComponent, TablaVistaDatosComponent } from '../../../../../centroemprendimiento-lib/src/public-api';


@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, DialogModule, CardModule, TableModule,
    FormMensageErrorComponent, SelectCatalogoEmpleabilidadComponent, SelectProgramaIndicadorComponent,
    SelectSubProgramaComponent, SelectEmpresasAliadasComponent, SelectDepartamentoComponent, ButtonModule,
    InputNumberModule, InputTextModule, InputMaskModule, InputTextareaModule, SelectCatalogoEmpleabilidadMultipleComponent,
    TablaVistaDatosComponent, RegistroActividadIndicadorComponent
  ]
})
export class IndicadoresComponent implements OnInit {
  
  indicadores: Indicador[]=[];
  visibleModal: boolean = false;
  indicador: Indicador | null | undefined ;

  columnsView: ColumnView[];

  constructor(private seguimientoIndicadorService: SeguimientoIndicadorService,
    private cdr: ChangeDetectorRef
  ) {
    this.columnsView = [];
    this.columnsView.push({name: 'indicador',title: 'Indicador',sort: true});
    this.columnsView.push({name: 'programa',title: 'Programa',sort: true});
    this.columnsView.push({name: 'sub_programa',title: 'Sub Programa',sort: true});
    this.columnsView.push({name: 'actividad',title: 'Actividad'});
    this.columnsView.push({name: 'empresa_aliada',title: 'Empresa Aliada',sort: true});
    this.columnsView.push({name: 'fecha',title: 'Fecha', sort:true});
    this.columnsView.push({name: 'registrados',title: 'Registrados'});
    this.columnsView.push({name: 'asistentes',title: 'Asistentes'});
    this.columnsView.push({name: 'recursos_empresa',title: 'Recursos'});
    this.columnsView.push({name: 'departamento',title: 'Departamento',sort: true});
  }

  ngOnInit() {
    this.loadList();
  }

  loadList(){
    this.seguimientoIndicadorService.consultaIndicadores().subscribe(data => {
      this.indicadores = data.data
    });
  }

  nuevo(){
    this.visibleModal = true;
    this.indicador = null;
  }

  editar(item:any){
    this.indicador = item;
    this.visibleModal = true;
    this.cdr.detectChanges();
  }

  cancelar(){
    this.visibleModal = false;
  }

  grabado(item:any){
    this.loadList();
    this.visibleModal = false;
  }
}

export interface Indicador{
  id_indicador: any;
  id_programa: any;
  id_sub_programa: any;
  actividad: string;
  id_empresa_aliada: any;
  fecha:any;
  observacion?: any;
  registrados?: number;
  asistentes?: number;
  recursos_utilizados?: number;
  estado: string;
  departamento?: string;
}
