export interface Evento {
    id:number;
    nombre:string;
    fecha:Date|string;
    fecha_fin:Date|string;
    hora_inicio?:string;
    hora_fin?:string
    estado:string;
    url:string;
    cupo?:number;
    id_tipo_asistencia:number;
    is_publico:boolean;
    facilitador?:string;
    tipo_asistencia?:string;
    tipo_evento:string;
    contenido:string;
    imagen:string;
    accion?:string;

    id_postulacion?:number;
    logo?:string;
}
