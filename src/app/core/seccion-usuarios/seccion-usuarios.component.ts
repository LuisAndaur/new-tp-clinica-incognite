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
  usuariosColumnas: string[] = ['fecha de registro', 'nombre', 'apellido', 'edad', 'dni', 'obraSocial', 'Especialidad', 'rol', 'estado', 'acción'];
  dataUsuarios: Array<any> = [];
  user!: string;

  constructor(private db: FirestoreService,
    private spinner: SpinnerService,
    private swal: SwalService){}

  ngOnInit(): void {

    this.db.obtenerUsuarios().subscribe((users) => {
      this.dataUsuarios = users;
    });
  }

  seleccion(user: string){
    this.user = user;
  }
}
