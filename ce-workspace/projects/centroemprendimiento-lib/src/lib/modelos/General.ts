import { HttpParams } from "@angular/common/http";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { formatDate } from '@angular/common';

export class General {
    public static fotoUserDefault = "images/user.png";
    public static fotoBannerDefault = "images/bannerCE.jpg";
    public static logoCE = "images/logo_ce2.jpg";
    public static timezone = "America/Guayaquil";
    public static dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
    public static dateFormat = "YYYY-MM-DD";
    public static timeFormat = "HH:mm";
    public static months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

    public static listaEstado: any[] = [{id: 'A', nombre: 'ACTIVO'}, {id: 'I', nombre: 'INACTIVO'}]

    public static validarCedula(cad) {
        //var cad = document.getElementById("ced").value.trim();
        var total = 0;
        var longitud = cad.length;
        var longcheck = longitud - 1;
        if (cad !== "" && longitud === 10) {
            for (let i = 0; i < longcheck; i++) {
            if (i % 2 === 0) {
                var aux = cad.charAt(i) * 2;
                if (aux > 9)
                aux -= 9;
                total += aux;
            } else {
                total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
            }
            }

            total = total % 10 ? 10 - total % 10 : 0;
            if (cad.charAt(longitud - 1) == total) {
            return true;
            } else {
            return false;
            }
        } else
            return false;
    }

    public static validarEmail(valor) {
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)) {
            return true;
        } else {
            return false;
        }
    }

    public static validarrucpnatural(number) {
        var dto = number.length;
        var valor;
        var acu = 0;
        if (number === "") {
            return false;
        }
        else {
            for (var i = 0; i < dto; i++) {
            valor = number.substring(i, i + 1);
            if (valor == 0 || valor == 1 || valor == 2 || valor == 3 || valor == 4 || valor == 5 || valor == 6 || valor == 7 || valor == 8 || valor == 9) {
                acu = acu + 1;
            }
            }
            if (acu == dto) {
            if (number.substring(10, 13) != '001') {
                //alert('Los tres últimos dígitos no tienen el código del RUC 001.');
                return false;
            }
            //while (number.substring(0, 2) > 24) {
            //alert('Los dos primeros dígitos no pueden ser mayores a 24.');
            //return false;
            //}
            return General.validarCedula(number.substring(0, 10));
            }
            else {
            //alert("ERROR: Por favor no ingrese texto");
            return false;
            }
        }
    }

    public static validarrucpjuridica(number) {
        var dto = number.length;
        var valor;
        var acu = 0;
        if (number === "") {
            return false;
        }
        else {
            for (var i = 0; i < dto; i++) {
            valor = number.substring(i, i + 1);
            if (valor == 0 || valor == 1 || valor == 2 || valor == 3 || valor == 4 || valor == 5 || valor == 6 || valor == 7 || valor == 8 || valor == 9) {
                acu = acu + 1;
            }
            }
            if (acu == dto) {
                while (number.substring(10, 13) != '001') {
                    //alert('Los tres últimos dígitos no tienen el código del RUC 001.');
                    return false;
                }
                while (number.substring(0, 2) > 24) {
                    //alert('Los dos primeros dígitos no pueden ser mayores a 24.');
                    return false;
                }
                var porcion1 = number.substring(2, 3);
                if (porcion1 < 6) {
                    //alert('El tercer dígito es menor a 6, por lo \ntanto el usuario es una persona natural.\n');
                    return false;
                }
                else {
                    if (porcion1 == 6) {
                        //alert('El tercer dígito es igual a 6, por lo \ntanto el usuario es una entidad pública.\n');
                        return true;
                    }
                    else {
                        if (porcion1 == 9) {
                            //alert('El tercer dígito es igual a 9, por lo \ntanto el usuario es una sociedad privada.\n');
                            return true;
                        }
                    }
                }
            }
            else {
                //alert("ERROR: Por favor no ingrese texto");
                return false;
            }
        }
        return false;
    }

    public static getEdad(fecha) {
        var hoy = new Date();
    
        if (!fecha) {
          return null;
        }
    
        var array_fecha = fecha.split("-")
        //si el array no tiene tres partes, la fecha es incorrecta
        if (array_fecha.length !== 3)
          return null;
        //compruebo que los ano, mes, dia son correctos
        var ano = parseInt(array_fecha[0]);
        if (isNaN(ano))
          return null;
    
        var mes = parseInt(array_fecha[1]);
        if (isNaN(mes))
          return null;
    
        var dia = parseInt(array_fecha[2]);
        if (isNaN(dia))
          return null;
    
        if (ano <= 99)
          ano += 1900;
        //resto los años de las dos fechas
        var edad = hoy.getFullYear() - ano - 1; //-1 porque no se si ha cumplido años ya este año
    
        //si resto los meses y me da menor que 0 entonces no ha cumplido años. Si da mayor si ha cumplido
        //if (hoy.getMonth() + 1 - mes < 0) //+ 1 porque los meses empiezan en 0
        //    return edad
        if (hoy.getMonth() + 1 - mes > 0)
          edad += 1;
    
        //entonces es que eran iguales. miro los dias
        //si resto los dias y me da menor que 0 entonces no ha cumplido años. Si da mayor o igual si ha cumplido
        if (hoy.getUTCDate() - dia >= 0)
          edad += 1;
    
        return edad;
    }

    public static getValidElementForm(element: FormControl, isSubmit: boolean, editable?): boolean {
        if (typeof editable == 'undefined') {
          editable = true;
        }
        if (!editable) {
          element.disable();
          return false;
        }
        if (!element.disabled) {
          return !element.valid && (element.dirty || element.touched || isSubmit)
        }
        return false;
    }

    public static fieldIsValid (control:AbstractControl | undefined, submited:boolean = true):boolean | undefined {
        return control?.invalid && 
              (control.dirty || 
                control.touched ||
                submited)
    }
      
    public static armarArbol(lista: any[], attrID?, attrIDPadre?, attrChilds?) {
        if (!attrChilds) {
          attrChilds = "child";
        }
        if (!attrID) {
          attrID = "id";
        }
        if (!attrIDPadre) {
          attrIDPadre = "id_padre";
        }
        lista.forEach(item => {
          item.id = item[attrID];
          item.id_padre = item[attrIDPadre];
        });
        let actividades = this._armarArbol(lista, null, attrChilds);
        return actividades;
    }
    
    private static _armarArbol(lista, padre, attrChilds) {
    let listaNew: any[] = [];
    padre = padre ? padre : { id: null, id_padre: null };
    lista.forEach(item => {
        if (item.id) {
        if (item.id_padre == padre.id) {
            item.isCollapsed = true;
            item[attrChilds] = this._armarArbol(lista, item, attrChilds);
            item.is_padre = false;
            if (item[attrChilds].length > 0) {
            item.is_padre = true;
            }
            listaNew.push(item);
        }
        }
    });
    return listaNew;
    }

    public static armarArbolTipo(lista: any[], optionArbolTipo?:OptionArbolTipo): any[]{
        if(!lista){return [];}
        if(lista.length == 0){ return []}

        const optionDefault: OptionArbolTipo = {
            attrValuesChild: Object.keys(lista[0]),
            attrNamesChild: Object.keys(lista[0]),
            attrChild: 'children',
            attrNameParent: Object.keys(lista[0]),
            attrValuesParent: Object.keys(lista[0]),
            attrTipo:'tipo'
        }

        const aptionsAtribute: OptionArbolTipo = {...optionDefault, ...optionArbolTipo};

        let listaGrupo: any[] = [];
        let arbol:any[] = [];
        lista.forEach(element => {
            let grupo = this._armarArbolTipo(element, arbol, aptionsAtribute);

            let item:any = {};
            aptionsAtribute.attrNamesChild.forEach((key, index) => {
                item[key] = element[aptionsAtribute.attrValuesChild[index]];
            });
            item._element = element;

            grupo[aptionsAtribute.attrChild].push(item);
        });
        Object.keys(arbol).forEach(clave => {
            listaGrupo.push(arbol[clave]);
        });
        return listaGrupo;
    }

    private static _armarArbolTipo(element, arbol, aptionsAtribute:OptionArbolTipo ){
        let grupo:any = {};
        aptionsAtribute.attrNameParent.forEach((key, index) => {
            grupo[key] = element[aptionsAtribute.attrValuesParent[index]];
        });

        if(arbol[element[aptionsAtribute.attrTipo]]){
            grupo = arbol[element[aptionsAtribute.attrTipo]];
        }else{
            arbol[element[aptionsAtribute.attrTipo]] = grupo;
            grupo[aptionsAtribute.attrChild] = [];
        }
        return grupo;
    }

    public static constructHttpParams(params: any) {
        let body = new HttpParams();
    
        Object.keys(params).forEach(key => {
          if (params[key] != undefined) {
            let param = params[key];
            if (param.constructor == Object || param.constructor == Array) {
              param = JSON.stringify(param);
            }
            body = body.set(key, param);
          }
        });
    
        return body;
    }

    public static constructFormData(params: any) {
        let body = new FormData();
    
        Object.keys(params).forEach(key => {
          if (params[key] != undefined) {
            let param = params[key];
            if (param.constructor == Object || param.constructor == Array) {
              param = JSON.stringify(param);
            }
            // body.set(key, param);
            body.append(key, param);
          }
        });
        return body;
    }

    public static getFechaFormat(dateObj: Date) {
      let yearMonth = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1) + '-' + dateObj.getUTCDate() + " " + dateObj.getHours() + ':' + dateObj.getUTCMinutes() + ":" + dateObj.getUTCSeconds();
      let fechaActual = formatDate(yearMonth, 'yyyy-MM-dd', 'en-US');
      return fechaActual;
    }
}

export interface OptionArbolTipo{
    attrValuesChild:string[];
    attrNamesChild:string[];
    attrChild:string;
    attrValuesParent:string[];
    attrNameParent:string[];
    attrTipo:string;
}