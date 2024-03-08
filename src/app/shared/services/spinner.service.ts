import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinner: NgxSpinnerService) {}

  public mostrar(){
    this.spinner.show();
  }

  public ocultar(){
    this.spinner.hide();
  }

}
