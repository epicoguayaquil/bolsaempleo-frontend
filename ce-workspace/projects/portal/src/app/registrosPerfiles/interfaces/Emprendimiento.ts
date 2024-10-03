export interface Emprendimiento {
    id: number|null;
    id_emprendimiento: number|null;
    nombre: string;
    descripcion?:string,
    id_tipo_emprendimiento: number|null;

    etiquetas?:any[];
    index?:number;
}
