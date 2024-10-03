export interface ParametrosFiltro{
    id_institucion?: any;
    id_organizacion?: any;
    id_pais?: any;
    id_ciudad?: any;
    ciudades?: any;
    etiquetas?: any;
    fecha_desde?: any;
    fecha_hasta?: any;
}

export interface ParametrosOptions{
    institucion: boolean;
    organizacion:boolean;
    ciudades: boolean;
    tipo_etiqueta: string;
    etiquetas?: boolean;
    fecha_desde?: boolean;
    fecha_hasta?: boolean;
}

export const defaultOptionParametros: ParametrosOptions = {
    institucion: true,
    organizacion:false,
    ciudades: false,
    etiquetas: false,
    tipo_etiqueta: 'INTERES',
    fecha_desde: false,
    fecha_hasta: false
  }