import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { SelectModel } from '../../modelos/SelectModel';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-selectTipoRegimen',
  templateUrl: './selectTipoRegimen.component.html',
  styleUrls: ['./selectTipoRegimen.component.css'],
  standalone:true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectTipoRegimenComponent),
      multi: true
    }
  ],
  imports: [FormsModule, ReactiveFormsModule, SelectButtonModule]
})
export class SelectTipoRegimenComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.fieldIdName = 'value';
  }

  override loadList(): void {
    this.listaItems = [{label: 'RUC', value: 'RUC'}, {label: 'RISE', value: 'RISE'}, {label: 'RIMPE', value: 'RIMPE'}];
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
