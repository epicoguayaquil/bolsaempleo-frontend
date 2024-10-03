export interface Respuesta {
    codigo:string;
    mensaje: string;
    data: any;
    mensaje_error?: string;
    code_error?: string;
    error?:any;
    path?:string;
    warning?:any;
}

export interface RespuestaPaginacion extends Respuesta{
    page:number;
    rows:number;
    records:number;
    pages:number;

    path?:string;
}

export interface RepuestaToken extends Respuesta{
    token:string;
    user:any;
    expiration_time:any;
}