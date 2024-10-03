export interface Persona{
    id?:number;
    id_persona?:number;
    nombre:string;
    apellido:string;
    fecha_nacimiento?:string;
    id_genero?:number | string;
    id_ciudad?:number | string;
    email:string;
    telefono:string;
    id_situacion_laboral?:string;
    tipo_identificacion:'C'|'P'|'R';
    identificacion:string;
    id_nivel_academico?:string;
    id_usuario?:string;
    direccion?:string;
    id_ciudad_domicilio?:string;
    telefono_fijo?:string;
    cv?:string;
    estado:'A'|'I';
    uso_datos?:string;
    perfil?:string;
    frase_perfil?:string;
    compromiso_participante?:string;
    latitud?:string;
    longitud?:string;
    foto?:string;
    foto_banner?:string;
    pais_natal?:string;
    observacion?:string;
    estado_civil?:string;
    carnet_discapacidad?:string;
    id_estado_civil?:number | string;

    redes_sociales?:any[]
    intereses?:any[],
    file_cv_base64?:FileCVBase64;

    ciudad?:any;
}

export interface FileCVBase64{
    filename:string;
    content?: string;
    contentType: string;
    extension: string;
}