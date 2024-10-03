import { Component, inject } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { CatalogoDBService } from "../servicios/CatalogoDB.service";
import { CatalogoService } from "../servicios/Catalogo.service";

@Component({
    template: ''
})
export abstract class SelectMultipleModel implements ControlValueAccessor {
    abstract loadList():void;
    abstract conversion():void;

    returnId: boolean = true;
    loading: boolean = false;
    submited: boolean = false;
    nemonicoCatalogo:string | null = null;
    loadLocal: boolean = true;
    fieldIdName: string = 'id';

    private _valueInput = null;
    protected _selectItems: any[] = [];
    protected isDisabled: boolean = false;
    public listaItems: any[] = [];

    protected catalogoBDService:CatalogoDBService = inject(CatalogoDBService);
    protected catalogoService:CatalogoService = inject(CatalogoService);

    ngOnInit(): void {
        if(this.nemonicoCatalogo && this.loadLocal){
            this.catalogoBDService.getCatalog(this.nemonicoCatalogo).subscribe( data => {
                if(this.nemonicoCatalogo == data.nemonico){
                    this.listaItems = data?.items;
                    this.conversion();
                    this.loadSelectItemInicial();
                }
            });
        }
        this.loadList();
    }

    onChange: any = () => {}; // Funcion a ser llamada cuando el valor cambia
    onTouched: any = () => {}; // Funcion a ser llamada cuando el control es tocado

    writeValue(value: any): void {
        if (JSON.stringify(value) !== JSON.stringify(this._selectItems)) {
            this._selectItems = value;
            this._valueInput = value;
            this.loadSelectItem();
        }
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
    get selectItems(): any[] | null {
        return this._selectItems;
    }

    set selectItems(val: any[] ) {
        this._selectItems = val;
        this.loadSelectItem();
        this.onChange(this.getItemSelected());
        this.onTouched();
    }

    getItemSelected(){
        if(!this._selectItems){
            return null;
        }
        if(this._selectItems && !this.returnId){
            let lista:any[] = [];
            this._selectItems.forEach(item =>{
                let elemento = this.listaItems?.find( element => element[this.fieldIdName] == item);
                if(elemento){
                    lista.push(elemento);
                }
            });
            return lista;
        }
        return this._selectItems;
    }

    protected loadSelectItem(val?){
        let lista:any[] = [];
        let _selectItems = val ? val : this._selectItems;
        if(_selectItems){
            lista = typeof _selectItems == 'string' ? _selectItems.split(',') : _selectItems;
            if(lista.length > 0){
                if(typeof lista[0] === 'object'){
                    let listaAux:any[] = [];
                    lista.forEach(item =>{
                        listaAux.push(item[this.fieldIdName]);
                    });
                    lista = listaAux;
                }
            }
        }
        if (JSON.stringify(lista) !== JSON.stringify(this._selectItems)) {
            this._selectItems = lista;
            this.onChange(this.getItemSelected());
        }
    }

    protected loadSelectItemInicial(){
        let val = this._selectItems ? this._selectItems : this._valueInput;
        this.loadSelectItem(val);
    }
}