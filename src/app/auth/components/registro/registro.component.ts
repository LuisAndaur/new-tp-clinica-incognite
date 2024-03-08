import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit{  

  user!: string;

  constructor() {}


  ngOnInit(){

  }

  seleccion(user: string){
    this.user = user;
  }
 
  
}
