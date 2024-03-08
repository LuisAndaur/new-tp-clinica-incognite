import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  success(text: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'success',
      title: "Éxito!",
      text: text,
      showConfirmButton: false,
      timer: 4000
    })
  }

  error(text: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'error',
      title: "Oops...",
      text: text,
      showConfirmButton: false,
      timer: 4000
    })
  }

  warning(text: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'warning',
      title: '¡Atención!',
      text: text,
      showConfirmButton: false,
      timer: 4000
    })
  }

  info(text: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'info',
      title: 'Info!',
      text: text,
      showConfirmButton: false,
      timer: 4000
    })
  }

  infoTitle(text: string, title: string){
    Swal.fire({
      // position: 'top-end',
      icon: 'info',
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 4000
    })
  }

}
