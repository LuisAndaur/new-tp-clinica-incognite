import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss']
})
export class SeccionUsuariosComponent implements OnInit{
  usuariosColumnas: string[] = ['fechaRegistro', 'nombre', 'apellido', 'edad', 'dni', 'obraSocial', 'especialidad', 'rol', 'estado', 'accion'];
  dataUsuarios: Array<any> = [];
  user!: string;

  constructor(private db: FirestoreService,
    private spinner: SpinnerService,
    private swal: SwalService){}

  ngOnInit(): void {

    this.db.obtenerUsuarios().subscribe((users) => {
      this.dataUsuarios = users;
      console.log('Uusuarios: ', this.dataUsuarios);
    });
  }

  seleccion(user: string){
    this.user = user;
  }

  aceptar(usuario:any, estado: string){
    this.spinner.mostrar();
    usuario.estado = estado;
    this.db.actualizarUsuario(usuario)
      .then(()=>{
        this.swal.success("Se actualizó el estado!");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      });
  }

  rechazar(usuario:any, estado: string){
    this.spinner.mostrar();
    usuario.estado = estado;
    this.db.actualizarUsuario(usuario)
      .then(()=>{
        this.swal.success("Se actualizó el estado!");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      });
  }

  actualizarEstado(usuario:any, estado: string): boolean{
    return usuario.estado == estado;
  }
}
