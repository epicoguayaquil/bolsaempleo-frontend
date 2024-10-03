export function organizarEtiquetas(lista: any[]): any[]{
    let listaEtiquetas: any[] = [];
    let arbol:any[] = [];
    lista.forEach(element => {
      let grupo = element.sub_tipo ? grupoArbolSubTipo(element, arbol): grupoArbolTipo(element, arbol);
      grupo.lista.push(element);
    });
    Object.keys(arbol).forEach(clave => {
      listaEtiquetas.push(arbol[clave]);
    });
    return listaEtiquetas;
  }
  
  function grupoArbolSubTipo(element, arbol){
    let grupo:EtiquetaGrupo = {nombre: element.sub_tipo, lista: [], listaSeleccionada: []};
    if(arbol[element.sub_tipo]){
      grupo = arbol[element.sub_tipo];
    }else{
      arbol[element.sub_tipo] = grupo;
    }
    return grupo;
  }
  
  function grupoArbolTipo(element, arbol){
    let grupo:EtiquetaGrupo = {nombre: element.tipo, lista: [], listaSeleccionada: []};
    if(arbol[element.tipo]){
      grupo = arbol[element.tipo];
    }else{
      arbol[element.tipo] = grupo;
    }
    return grupo;
  }

  export interface EtiquetaGrupo{
    nombre:string;
    lista: Array<any>;
    listaSeleccionada: Array<any>; 
  }