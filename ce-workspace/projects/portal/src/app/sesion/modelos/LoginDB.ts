import { DBSchema } from "idb";

export interface LoginDB extends DBSchema {
    paramSystem: {
        key: string;  // El tipo de la clave es string, que corresponde al 'nemonico'
        value: TipoParamSistema;
    };
}

export interface TipoParamSistema{
    nemonico: string;
    value: any;
}