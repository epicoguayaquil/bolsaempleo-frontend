import { ChangeDetectorRef, Component, QueryList, ViewChildren, forwardRef, inject } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { Emprendimiento } from '../../interfaces/Emprendimiento';
import { EmprendimientoComponent } from './emprendimiento/emprendimiento.component';
import { ButtonModule } from 'primeng/button';
import { ComponentForm } from '../../../../../../centroemprendimiento-lib/src/public-api';

@Component({
  selector: 'app-emprendimientos',
  templateUrl: './emprendimientos.component.html',
  styleUrls: ['./emprendimientos.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TabViewModule, ButtonModule, EmprendimientoComponent],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmprendimientosComponent),
      multi: true,
    }
  ]
})
export class EmprendimientosComponent extends ComponentForm {

  @ViewChildren(EmprendimientoComponent) emprendimientoComponents!: QueryList<EmprendimientoComponent>;

  override formDatos =  this.formBuilder.group({});

  emprendimientos:Emprendimiento[] = [];
  activeIndex:number = 0;
  constructor(private cdr: ChangeDetectorRef) { 
    super();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  identificadorEmp:number = 0;
  addEmprendimiento(){
    this.identificadorEmp++;
    let emprendimiento:Emprendimiento = {
      id:null,
      id_emprendimiento:null,
      nombre: 'NUEVO' + (this.emprendimientos.length + 1),
      id_tipo_emprendimiento:null,
      descripcion: '',
      index: this.identificadorEmp
    }
    this.emprendimientos.push(emprendimiento);
    setTimeout(()=>{
      this.activeIndex = this.emprendimientos.length -1;
    }, 100);

    this.generarCambios();
  }

  removeEmprendimiento(identificador:any){
    const index = this.emprendimientos.findIndex(m => m.index === identificador);
    this.emprendimientos.splice(index, 1);
    setTimeout(()=>{
      this.activeIndex = 0;
    }, 100);

    this.generarCambios();
  }

  generarCambios(){
    this.onChange(this.getValues());
    this.onTouched();
  }

  override getValues() {
    return {'emprendimientos':this.emprendimientos};
  }

  override setValues(values: any): void {
    if(values && values.emprendimientos){
      this.emprendimientos = values.emprendimientos;
    }
  }


  override isValid(validateForm?: boolean | null): boolean {
    let valido = true;
    if(this.emprendimientos.length == 0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe ingresar por lo menos un emprendimiento'});
      return false;
    }
    this.emprendimientoComponents.forEach((component, index) => {
      if(!component.isValid(true)){
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Uno de los emprendimientos faltan campos obligatorios'});
        valido = false;
      }
    });
    return valido;
  }
}