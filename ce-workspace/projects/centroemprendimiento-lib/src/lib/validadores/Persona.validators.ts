import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { General } from "../modelos/General";
import moment from "moment";

export const validarIdentificacion: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const tipo_identificacion = control.get('tipo_identificacion');
    const identificacion = control.get('identificacion');
    const persona = control.get('persona');

    const identificacionErrors = identificacion?.errors || {};

    const eliminarValidacion = () => {
      if (identificacionErrors['cedula']) {
        delete identificacionErrors['cedula'];
        identificacion?.setErrors(Object.keys(identificacionErrors).length ? identificacionErrors : null);
      }
      if (identificacionErrors['ruc']) {
        delete identificacionErrors['ruc'];
        identificacion?.setErrors(Object.keys(identificacionErrors).length ? identificacionErrors : null);
      }
    }

    const agregarError = (name) => {
      let errores:any = { ...identificacionErrors};
      errores[name] = true;
      identificacion?.setErrors(errores);
    }
  
    if(!tipo_identificacion || !identificacion){
      eliminarValidacion();
      return null;
    }
  
    if(!tipo_identificacion.value || !identificacion.value){
      eliminarValidacion();
      return null;
    }
  
    switch(tipo_identificacion.value){
      case 'C': 
        if(General.validarCedula(identificacion.value)){
          return null;
        }
        agregarError('cedula');
        return {'cedula': true}
      case 'R':
        if(persona?.value == 'N'){
          if(General.validarrucpnatural(identificacion.value)){
            return null;
          }
          agregarError('ruc');
          return {'ruc': true};
        }else{
          if(General.validarrucpjuridica(identificacion.value)){
            return null;
          }
          agregarError('ruc');
          return {'ruc': true};
        }
      case 'P':
        eliminarValidacion();
        return null;
    }
    eliminarValidacion();
    return null;
};

export function validAge(minAge: number, maxAge: number): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {
      let v: string = control.value;

      if (v) {
        const d = moment(v);
        const date_min = moment().subtract(minAge, 'years');
        const date_max = moment().subtract(maxAge, 'years');;

        if (d > date_min) {
          return { validTime: true, minAge: minAge }
        }

        if (d < date_max) {
          return { validTime: true, maxAge: maxAge };
        }
      }
      return null;
    }
}

export const validarHojaVida: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const cv:any = control.get('cv');
  const file_cv:any = control.get('file_cv');

  const cvErrors = cv?.errors || {};
  const fileCvErrors = file_cv?.errors || {};

  if(!cv && !file_cv){
    cv?.setErrors({ ...cvErrors});
    file_cv.setErrors({ ...fileCvErrors});
    return null;
  }

  if(!cv?.value && !file_cv?.value){
    cv.setErrors({ ...cvErrors, 'hoja_vida': true });
    file_cv.setErrors({ ...fileCvErrors, 'hoja_vida': true });
    return null;
  }

  if (cvErrors['hoja_vida']) {
    delete cvErrors['hoja_vida'];
    cv.setErrors(Object.keys(cvErrors).length ? cvErrors : null);
  }

  if (fileCvErrors['hoja_vida']) {
    delete fileCvErrors['hoja_vida'];
    file_cv.setErrors(Object.keys(fileCvErrors).length ? fileCvErrors : null);
  }

  return null;

};