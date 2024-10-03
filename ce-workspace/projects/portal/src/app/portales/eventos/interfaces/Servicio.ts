import { Evento } from "./Evento";

export interface Servicio extends Evento {
    fecha_inicio?:Date|string;
    fecha_ini_registro?:Date|string;
    fecha_fin_registro?:Date|string;
    descripcion_edi?:string;

    programa?:Programa;
}

export interface Programa {
    id:number;
    nombre:string;
    estado:string;
    logo?:string;
    banner?:string;
    id_programa_principal?:number;
    id_programa_padre?:number;
    id_programa?:number;
    orden?:number;
    descripcion?:string;

    actividades?:Actividad[];
    programa_obligatorios?:Programa[];

}

export interface Actividad {
    id:number;
    nombre:string;
}