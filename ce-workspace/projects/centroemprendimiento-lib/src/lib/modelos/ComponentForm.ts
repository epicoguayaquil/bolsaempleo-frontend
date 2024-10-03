import { AbstractControl, ControlValueAccessor, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { General } from "./General";
import { Component, Input, OnChanges, SimpleChanges, inject } from "@angular/core";
import { MessageService } from "primeng/api";

@Component({
  template: ''
})
export abstract class ComponentForm implements ControlValueAccessor, OnChanges {
    
    abstract formDatos: FormGroup;
    @Input() submited: boolean = false;
    private _valueInput:any = null;
    protected isDisabled: boolean = false;
    @Input() fieldsToDisable?: Array<string> | null;
    @Input() requiredFields?: Array<string>;
    @Input() visibleFields?: Array<string>;
    @Input() disable: boolean = false;
    @Input() visibletitulo: boolean = true;

    protected formBuilder: FormBuilder = inject(FormBuilder);
    protected messageService:MessageService = inject(MessageService);

    ngOnInit() {
      this.registrarCambios()
    }

    ngOnChanges(changes: SimpleChanges): void {
      if(changes['disable'] && changes['disable'].currentValue === true){
        if(!this.fieldsToDisable){
          this.disableForm({allFields: true, fields:null, enableFields:null})
        }else{
          this.disableForm({allFields: false, fields:this.fieldsToDisable, enableFields:null})
        }
      }
      if(changes['disable'] && changes['disable'].currentValue === false){
        this.enableForm();
      }

      if(changes['fieldsToDisable'] && changes['fieldsToDisable'].currentValue){
        this.fieldsToDisable = changes['fieldsToDisable'].currentValue;
        if(this.disable){
          if(this.fieldsToDisable){
            this.disableForm({allFields: false, fields:this.fieldsToDisable, enableFields:null});
          }else{
            this.disableForm({allFields: true, fields:null, enableFields:null})
          }
        }else{
          this.enableForm();
        }
      }

      if(changes['requiredFields'] && changes['requiredFields'].currentValue){
        this.cambiarCamposRequeridos();
      }
    }
 
    isValid (validateForm: boolean | null = null): boolean | undefined {
        if (this.formDatos) {
          if (validateForm != null) 
            this.submited = validateForm;
          return this.formDatos.valid;
        }
        return false;
    }

    getValues () {
        let values:any = {};
        if(this._valueInput){
            values = { ...this._valueInput, ...this.formDatos.value };
        }else{
            
        }
        return values;
    }

    setValues (values: any) {
        this.formDatos.patchValue(values);
    }

    getForm(){
      this.formDatos;
    }

    disableForm (params:ParamFieldForm = {allFields: true, fields:null, enableFields:null}) {
        if (params.allFields) {
          this.formDatos.disable();
        }

        if (params.fields) {
          params.fields.map(f => {
            this.formDatos.controls[f].disable();
          })
        }

        if (params.enableFields) {
          params.enableFields.map(f => {
            this.formDatos.controls[f].enable();
          })
        }
    }

    enableForm() {
        this.formDatos.enable();
    }

    clear () {
        this.submited = false;
        this.formDatos.reset();
    }

    // retorna true cuando es invalido
    fieldIsValid (nameField:any):boolean | undefined {
      return General.fieldIsValid(this.formDatos.controls[nameField], this.submited);
    }

    onChange: any = () => {}; // Funcion a ser llamada cuando el valor cambia
    onTouched: any = () => {}; // Funcion a ser llamada cuando el control es tocado

    writeValue(obj: any): void {
      this._valueInput = obj;
      this.setValues(obj);
    }
    registerOnChange(fn: any): void {
      this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
      this.isDisabled = isDisabled;
    }

    registrarCambios(){
      this.formDatos.valueChanges.subscribe((value) => {
        let values = this.getValues();
        this.onChange(values);
        this.onTouched();
      });
    }

    getValueInicial(){
      return this._valueInput;
    }

    mostrarCampo(field:string){

      return (this.visibleFields && this.visibleFields.length > 0) ? this.visibleFields.includes(field) : true;
    }

    cambiarCamposRequeridos() {
      if (this.requiredFields && this.requiredFields.length > 0) {
        this.removeSpecificValidatorFromAllControls(Validators.required);
        this.requiredFields.forEach(field => {
          if (this.formDatos.controls[field]) {
            this.addValidatorControl(this.formDatos.controls[field], Validators.required);
          }
        });
      } else {
        this.addSpecificValidatorToAllControls(Validators.required);
      }
    }

    addValidatorControl(control: AbstractControl, validator: ValidatorFn) {
      if (!control.hasValidator(validator)) {
        control.addValidators(validator);
        control.updateValueAndValidity();
      }
    }

    addSpecificValidatorToAllControls(validator: ValidatorFn) {
      Object.keys(this.formDatos.controls).forEach(controlName => {
        const control = this.formDatos.get(controlName);
        if (control) {
          this.addValidatorControl(control, validator);
        }
      });
    }
  

    removeSpecificValidatorFromAllControls(validator: ValidatorFn) {
      Object.keys(this.formDatos.controls).forEach(controlName => {
        const control = this.formDatos.get(controlName);
        this.removeSpecificValidatorControl(control, validator);
      });
    }

    removeSpecificValidatorControl(control: AbstractControl | null, validator: ValidatorFn){
      if (control?.hasValidator(validator)) {
        control.removeValidators(validator);
      }
    }
}

export interface ParamFieldForm{
    allFields?: boolean, 
    fields?:Array<string> | null, 
    enableFields?:Array<string> | null
}