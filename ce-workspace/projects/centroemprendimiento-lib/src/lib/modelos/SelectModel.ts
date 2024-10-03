import { ControlValueAccessor } from "@angular/forms";
import { General } from "./General";
import { Catalogo } from "../interfaces/CatalogoDB";
import { Component, inject } from "@angular/core";
import { CatalogoDBService } from "../servicios/CatalogoDB.service";
import { CatalogoService } from "../servicios/Catalogo.service";

@Component({
    template: ''
})
export abstract class SelectModel implements ControlValueAccessor {

    abstract loadList():void;
    nemonicoCatalogo:string | null = null;
    
    returnId: boolean = true;
    loading: boolean = false;
    submited: boolean = false;
    loadLocal: boolean = true;
    fieldIdName: string = 'id';
    private _valueInput = null;

    protected probarComponent: string = ''; // para probar

    protected _selectItem: any | undefined;
    protected isDisabled: boolean = false;
    public listaItems: any[] | Catalogo[] | undefined = [];

    public listaEstado: any[] = General.listaEstado;

    protected catalogoBDService:CatalogoDBService = inject(CatalogoDBService);
    protected catalogoService:CatalogoService = inject(CatalogoService);

    constructor(){}

    ngOnInit(): void {
        if(this.nemonicoCatalogo && this.loadLocal){
            this.catalogoBDService.getCatalog(this.nemonicoCatalogo).subscribe( data => {
                if(this.nemonicoCatalogo == data.nemonico){
                    this.listaItems = data?.items;
                    this.loadSelectItemInicial();
                }
            });
        }
        this.loadList();
    }

    onChange: any = () => {}; // Funcion a ser llamada cuando el valor cambia
    onTouched: any = () => {}; // Funcion a ser llamada cuando el control es tocado

    writeValue(value: any): void {
        this._selectItem = value;
        this._valueInput = value;
        this.loadSelectItem();
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

    // Propiedad para el modelo bidireccional
    get selectItem() {
        return this._selectItem;
    }

    set selectItem(val: any) {
        this._selectItem = val;
        this.loadSelectItem();
        this.onChange(this.getItemSelected());
        this.onTouched();
    }

    getItemSelected(){
        if(!this._selectItem){
            return null;
        }
        if(this.returnId ){
            return this._selectItem[this.fieldIdName];
        }
        return this._selectItem;
    }

    get valueInput(){
        return this._valueInput;
    }

    protected loadSelectItem(val?){
        let institucion = val ? val : this._selectItem;
        if(institucion){
            if(typeof institucion === 'object'){
                institucion = this.listaItems?.find( element => element[this.fieldIdName] == institucion[this.fieldIdName]);
            }else{
                institucion = this.listaItems?.find( element => element[this.fieldIdName] == institucion);
            }
        }
        this._selectItem = institucion;
        if(institucion){
            this.onChange(this.getItemSelected());
        }
    }

    protected loadSelectItemInicial(){
        let val = this._selectItem ? this._selectItem : this._valueInput;
        this.loadSelectItem(val);
    }
}