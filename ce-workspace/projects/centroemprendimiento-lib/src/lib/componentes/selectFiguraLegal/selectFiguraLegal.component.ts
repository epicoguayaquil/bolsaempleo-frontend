import { ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModel } from '../../modelos/SelectModel';

@Component({
  selector: 'app-selectFiguraLegal',
  templateUrl: './selectFiguraLegal.component.html',
  styleUrls: ['./selectFiguraLegal.component.css'],
  standalone:true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFiguraLegalComponent),
      multi: true
    }
  ],
  imports: [FormsModule, ReactiveFormsModule, SelectButtonModule]

})
export class SelectFiguraLegalComponent extends SelectModel {
  
  @Input() override returnId: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {
    super();
    this.fieldIdName = 'value';
  }

  override loadList(): void {
    this.listaItems = [{label: 'Natual', value: 'N'}, {label: 'Jurídica', value: 'J'}];
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
