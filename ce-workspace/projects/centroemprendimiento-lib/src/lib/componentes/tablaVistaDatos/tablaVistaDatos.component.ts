import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-tablaVistaDatos',
  templateUrl: './tablaVistaDatos.component.html',
  styleUrls: ['./tablaVistaDatos.component.css'],
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, ButtonModule, InputGroupModule,
    InputGroupAddonModule, IconFieldModule, InputIconModule
  ]
})
export class TablaVistaDatosComponent implements OnInit {

  @Input() lista: any[]=[];
  @Input() globalFilterFields: any; //['indicador', 'programa', 'sub_programa', 'empresa_aliada', 'fecha']
  @Input() rowsPerPageOptions: any; // [10, 25, 50]
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() columnsView: ColumnView[] = [];
  @Output() newRecord = new EventEmitter<any>();
  @Output() editRecord = new EventEmitter<any>();
  @ViewChild('dt2') private tabla?: Table;

  record:any;

  constructor() { }

  ngOnInit() {
  }

  nuevo(){
    this.newRecord.emit();
  }

  editar(record){
    this.editRecord.emit(record);
    
    //this.btnNuevo.autofocus = true;
  }

  filtrar(event){
    this.tabla?.filterGlobal(event.target?.value, 'contains')
  }
}

export interface ColumnView{
  name:string;
  title?:string;
  sort?: boolean;
}