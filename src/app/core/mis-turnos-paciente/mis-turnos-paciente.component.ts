import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
  reseniaEspecialista: string;
  comentarioEspecialista: string;
  comentarioPaciente: string;
  comentarioAdministrador: string;
  diagnosticoEspecialista: string;
  encuestaPaciente: string;
  calificacionPaciente: string;
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
    if(turno?.reseniaEspecialista){
      this.swal.infoTitle(turno?.reseniaEspecialista, "Reseña del Especialista");
    }
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

  async realizarEncuesta(turno: any){
    const respuesta = await this.swal.option(
      {"opcion1":"Si","opcion2":"No"},"Encuesta","¿Recomendaría la clinica?");

    if(respuesta === null || respuesta === undefined){
      this.swal.info("Encuesta cancelada o no completada.");
    }
    else{ 
      if(respuesta == 'opcion1' || respuesta == 'opcion2'){

        let auxTurno = new Turno();
        this.turnos?.forEach( t => {
          if(t.id === turno.id){
            auxTurno = t;
          }
        });
        auxTurno.encuestaPaciente =  respuesta == 'opcion1' ? 'La recomendaría' : "No la recomendaría";
        this.spinner.mostrar();
        this.db.modificarTurno(auxTurno)
          .then(()=>{
            this.swal.success("Se cancelo el turno");
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
        reseniaEspecialista: t.reseniaEspecialista,
        comentarioEspecialista: t.comentarioEspecialista,
        comentarioPaciente: t.comentarioPaciente,
        comentarioAdministrador: t.comentarioAdministrador,
        diagnosticoEspecialista: t.diagnosticoEspecialista,
        encuestaPaciente: t.encuestaPaciente,
        calificacionPaciente: t.calificacionPaciente
      };

      array.push(data);
    });

    return array;
  }

  mostrarHistoriaClinica(id: string) {
    // this.posicionDeHistoria = -1;
    // this.turnosConHistoriasClinicas = this.turnosDePaciente?.filter(t=> {
    //   return t.turno.historiaClinica && t.turno.idPaciente == _turnoEspecialista.turno.idPaciente;
    // }).map((t,index)=>{
    //   if(t.turno.fechaInicio == _turnoEspecialista.turno.fechaInicio){
    //     this.posicionDeHistoria = index;
    //   }
    //   return t;
    // })!;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DataTurnoPacientes.filter = filterValue.trim().toLowerCase();
  }

}
