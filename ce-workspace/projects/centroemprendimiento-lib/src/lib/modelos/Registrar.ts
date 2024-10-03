import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { General } from "./General";
import { MessageService } from "primeng/api";

@Component({
    template: ''
})
export abstract class Registrar{
    abstract insertRequest(registro:any):any;
    abstract updateRequest(registro:any):any;
    @Output() saved = new EventEmitter<any>();
    @Output() error = new EventEmitter<any>();
    @Output() canceled = new EventEmitter<any>();
    private _registro: any;

    formDatos: FormGroup | undefined;
    submited: boolean = false;

    protected formBuilder = inject(FormBuilder);
    protected messageService = inject(MessageService);

    private isActualizacion = false;

    public grabar(){
        if(!this.isActualizacion){
            this.insertar();
        }else{
            this.actualizar();
        }
    }

    private insertar(){
        this.submited = true;
        if(this.formDatos?.invalid){
            return;
        }
        let registro = {...this.formDatos?.value};
        this.insertRequest(registro);
    };

    private actualizar(){
        this.submited = true;
        if(this.formDatos?.invalid){
            return;
        }
        let registro = {...this.formDatos?.value};
        registro.id = this._registro.id;
        this.updateRequest(registro);
    }

    public cancelar() {
        this.canceled.emit();
    }

    fieldIsValid (nameField:any) {
        return General.fieldIsValid(this.formDatos?.controls[nameField], this.submited);
    }

    @Input()
    get registro(): any{
        return this._registro;
    }

    set registro(registro){
        this._registro = registro;
        if(this._registro){
            this.isActualizacion = true;
            this.formDatos?.patchValue(this._registro);
        }else{
            this.isActualizacion = false;
            this.formDatos?.reset();
        }
    }
}