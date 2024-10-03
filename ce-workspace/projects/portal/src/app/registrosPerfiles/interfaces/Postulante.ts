export interface Postulante{
    id?:string | number;
    id_postulante?:string | number;
    id_persona?:string | number;
    is_estudiante?:boolean | number;
    is_trabajando?:boolean | number;
    has_experiencia?:boolean | number;
    perfil?:string;
    id_rango_salarial?:string | number;
    id_modalidad?:string | number;
    observacion?:string;
    id_usuario?:string | number;
    otras_habilidades?:string;

    titulos_academicos?:any[];
    experiencias_laborales?:any[];
    habilidades?:any[]

}
