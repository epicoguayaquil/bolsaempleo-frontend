import { DBSchema } from "idb";

export interface CatalogoDB extends DBSchema {
    catalogs: {
        key: string;  // El tipo de la clave es string, que corresponde al 'nemonico'
        value: CatalogoTipo;
    };
}

export interface CatalogoTipo{
    nemonico: string;
    version: number;
    items: Array<Catalogo>;
}

export interface Catalogo{
    id: number; 
    nombre: string; 
    tipo: string
}