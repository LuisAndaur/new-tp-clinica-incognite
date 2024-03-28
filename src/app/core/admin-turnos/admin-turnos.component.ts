import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Turno } from 'src/app/shared/models/turno.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';

export interface DataTurno {
  id: string;
  fecha: string;
  inicio: string;
  fin: string;
  duracion: string;
  paciente: string;
  especialista: string;
  especialidad: string;
  estado: string;
  comentarioEspecialista: string;
  comentarioPaciente: string;
  comentarioAdministrador: string;
}

@Component({
  selector: 'app-admin-turnos',
  templateUrl: './admin-turnos.component.html',
  styleUrls: ['./admin-turnos.component.scss']
})
export class AdminTurnosComponent implements OnInit {

  filtro: string = "";
  turnos: Array<any> | null = [];
  usuariosColumnas: string[] = ['fecha', 'inicio', 'fin', 'duracion', 'paciente', 'especialista', 'especialidad', 'estado', 'accion'];
  dataTurnos: any;

  constructor(private db: FirestoreService,
              private spinner: SpinnerService,
              private swal: SwalService){}

  ngOnInit(): void {

    this.spinner.mostrar();    
    this.db.obtenerTurnosCompletos().subscribe( dbTurnos => {
        this.turnos = dbTurnos;
        let data = this.dataFilter(this.turnos);
        this.dataTurnos = new MatTableDataSource(data);
        console.log('turnos: ', data);

        this.spinner.ocultar();
    });

  }

  async cancelarTurno(id: string){

    const respuesta = await this.swal.textarea();

    let turnoACancelar = new Turno();
    this.turnos?.forEach( t => {
      if(t.id === id){
        turnoACancelar = t;
      }
    });

    if(respuesta === undefined){
      this.swal.warning("El turno no se canceló, debe dejar un comentario.");
    }
    else{ 
      if(respuesta){
        turnoACancelar.estadoTurno = "Cancelado";
        turnoACancelar.comentarioAdministrador = respuesta;
        this.spinner.mostrar();
        this.db.modificarTurno(turnoACancelar)
          .then(()=>{
            this.swal.success("Turno cancelado");
          })
          .catch((e:Error)=>{
            this.swal.error(e.message);
          })
          .finally(()=>{
            this.spinner.ocultar();
          })
      }
      else{
        this.swal.error("No se puede cancelar.");
      }
    }
  }

  private dataFilter(turnos: Turno[]){
    let array: DataTurno[] = [];
    let data = <DataTurno>{};
    turnos.forEach( t => {
      data = <DataTurno>{
        id: t.id,
        fecha: t.fecha,
        inicio: t.horaInicio,
        fin: t.horaFinal,
        duracion: t.duracion.toString(),
        paciente: t.paciente.nombre + ' ' + t.paciente.apellido,
        especialista: t.especialista.nombre + ' ' + t.especialista.apellido,
        especialidad: t.especialidad.especialidad,
        estado: t.estadoTurno,
        comentarioEspecialista: t.comentarioEspecialista,
        comentarioPaciente: t.comentarioPaciente,
        comentarioAdministrador: t.comentarioAdministrador,
      };

      array.push(data);
    });

    return array;
  }

  mostrarResenia(turno: any){
    if(turno?.comentarioEspecialista){
      this.swal.infoTitle(turno?.comentarioEspecialista, "Comentario del Especialista");
    }
    if(turno?.comentarioPaciente){
      this.swal.infoTitle(turno?.comentarioPaciente, "Comentario del Paciente");
    }
    if(turno?.comentarioAdministrador){
      this.swal.infoTitle(turno?.comentarioAdministrador, "Comentario del Administrador");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTurnos.filter = filterValue.trim().toLowerCase();
  }

}
