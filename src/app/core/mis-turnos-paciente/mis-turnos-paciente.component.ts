import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Encuesta } from 'src/app/shared/models/encuesta.class';
import { HistoriaClinica } from 'src/app/shared/models/historia-clinica.class';
import { Turno } from 'src/app/shared/models/turno.class';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';

export interface DataTurnoPaciente {
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
  diagnosticoEspecialista: string;
  encuestaPaciente: Encuesta;
  calificacionPaciente: string;
  historiaClinica: HistoriaClinica;
}

@Component({
  selector: 'app-mis-turnos-paciente',
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrls: ['./mis-turnos-paciente.component.scss']
})
export class MisTurnosPacienteComponent implements OnInit {

  currentUser!: Usuario;
  filtro: string = "";
  turnos: Array<any> | null = [];
  usuariosColumnas: string[] = ['fecha', 'inicio', 'fin', 'duracion', 'paciente', 'especialista', 'especialidad', 'estado', 'accion', 'hc'];
  DataTurnoPacientes: any;
  turnoSeleccionado!: Turno;
  mostrarhc: boolean = false;
  emailPacientePadre: string = "";
  idTurnoPadre: string = "";
  mostrarCrear: boolean = false;

  constructor(private db: FirestoreService,
              private localStorge: LocalstorageService,
              private spinner: SpinnerService,
              private swal: SwalService){}

  ngOnInit(): void {

    this.currentUser = this.localStorge.getItem('usuario');

    this.spinner.mostrar();    
    this.db.obtenerTurnosPaciente(this.currentUser.email).subscribe( dbTurnos => {
        this.turnos = dbTurnos;
        let data = this.dataFilter(this.turnos);
        this.DataTurnoPacientes = new MatTableDataSource(data);
        console.log('turnos paciente: ', data);

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

  mostrarDiagnostico(turno: any){
    if(turno?.diagnosticoEspecialista){
      this.swal.infoTitle(turno?.diagnosticoEspecialista, "Diagnostico del Especialista");
    }
  }

  async realizarEncuesta(id: string){
   
    let auxTurno = new Turno();

    this.turnos?.forEach( t => {
      if(t.id === id){
        auxTurno = t;
      }
    });

    this.turnoSeleccionado = auxTurno;
  }

  async calificar(turno: any){

    const respuesta = await this.swal.textareaTitle("Calificar atención");
    if(respuesta === null || respuesta === undefined){
      this.swal.info("Calificación cancelada o vacía.");
    }
    else{
      if(respuesta){

        let auxTurno = new Turno();
        this.turnos?.forEach( t => {
          if(t.id === turno.id){
            auxTurno = t;
          }
        });
        
        auxTurno.calificacionPaciente = respuesta;
        this.spinner.mostrar();
        this.db.modificarTurno(auxTurno)
          .then(()=>{
            this.swal.success("Gracias por su calificación!");
          })
          .catch((e:Error)=>{
            this.swal.error(e.message);
          })
          .finally(()=>{
            this.spinner.ocultar();
          })
      }
      else{
        this.swal.error("Error del sistema.");
      }
    }
  }


  private dataFilter(turnos: Turno[]){
    let array: DataTurnoPaciente[] = [];
    let data = <DataTurnoPaciente>{};
    turnos.forEach( t => {
      data = <DataTurnoPaciente>{
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
        diagnosticoEspecialista: t.diagnosticoEspecialista,
        encuestaPaciente: t.encuestaPaciente,
        calificacionPaciente: t.calificacionPaciente,
        historiaClinica: t.historiaClinica
      };

      array.push(data);
    });

    return array;
  }

  mostrarHistoriaClinica(id: string) {

    let auxTurno = new Turno();
    this.turnos?.forEach( t => {
      if(t.id === id){
        auxTurno = t;
      }
    });

    this.turnoSeleccionado = auxTurno;
    this.idTurnoPadre = id;
    this.emailPacientePadre = auxTurno.paciente.email;
    this.mostrarhc = true;
  }

  mostrarCrearEncuesta(mostrarCrear: boolean){
    this.mostrarCrear = mostrarCrear;
  }

  verHistoria(ver: boolean){
    this.mostrarhc = ver;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DataTurnoPacientes.filter = filterValue.trim().toLowerCase();
  }

}
