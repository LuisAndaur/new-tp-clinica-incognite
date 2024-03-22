import { Component, OnInit } from '@angular/core';
import { Especialidad } from 'src/app/shared/models/especialidad.class';
import { Especialista } from 'src/app/shared/models/especialista.class';
import { Paciente } from 'src/app/shared/models/paciente.class';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent implements OnInit {

  usuarioActual!: any;
  usuario!: Usuario;
  obraSocial!:string;
  img2!:any;
  especialidades!:Array<Especialidad>;
  mostrarHorarios:boolean = false;

  constructor(private localStorage: LocalstorageService ){}

  ngOnInit(): void {

    this.usuarioActual = this.localStorage.getItem('usuario');

    if(this.usuarioActual != null){
      
      this.usuario = this.usuarioActual;

      if(this.usuario.tipo == 'paciente'){
        this.img2 = this.usuarioActual.img2;
        this.obraSocial = this.usuarioActual.obraSocial
      }

      if(this.usuario.tipo == 'especialista'){
        this.especialidades = this.usuarioActual.especialidades;
      }

    }
  }

}
