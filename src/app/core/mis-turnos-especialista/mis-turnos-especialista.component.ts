import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HistoriaClinica } from 'src/app/shared/models/historia-clinica.class';
import { Turno } from 'src/app/shared/models/turno.class';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';

export interface DataTurnoEspecialista {
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
  encuestaPaciente: string;
  calificacionPaciente: string;
  historiaClinica: HistoriaClinica
}

@Component({
  selector: 'app-mis-turnos-especialista',
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrls: ['./mis-turnos-especialista.component.scss']
})
export class MisTurnosEspecialistaComponent implements OnInit {

  currentUser!: Usuario;
  filtro: string = "";
  turnos: Array<any> | null = [];
  usuariosColumnas: string[] = ['fecha', 'inicio', 'fin', 'duracion', 'paciente', 'especialista', 'especialidad', 'estado', 'accion', 'hc'];
  DataTurnoEspecialistas: any;
  turnoSeleccionado!: Turno;
  mostrarCrear: boolean = false;
  mostrarhc: boolean = false;
  emailPacientePadre: string = "";
  idTurnoPadre: string = "";

  constructor(private db: FirestoreService,
              private localStorge: LocalstorageService,
              private spinner: SpinnerService,
              private swal: SwalService){}

  ngOnInit(): void {

    this.currentUser = this.localStorge.getItem('usuario');

    this.spinner.mostrar();    
    this.db.obtenerTurnosEspecialista(this.currentUser.id).subscribe( dbTurnos => {
        this.turnos = dbTurnos;
        let data = this.dataFilter(this.turnos);
        this.DataTurnoEspecialistas = new MatTableDataSource(data);
        console.log('turnos paciente: ', data);

        this.spinner.ocultar();
    });

  }

  async aceptarTurno(id: string){

    let turnoAAceptar = new Turno();
    this.turnos?.forEach( t => {
      if(t.id === id){
        turnoAAceptar = t;
      }
    });

    turnoAAceptar.estadoTurno = "Aceptado";
    this.spinner.mostrar();
    this.db.modificarTurno(turnoAAceptar)
      .then(()=>{
        this.swal.success("Turno aceptado");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      })
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

  async rechazarTurno(id: string){

    let turnoARechazar = new Turno();
    this.turnos?.forEach( t => {
      if(t.id === id){
        turnoARechazar = t;
      }
    });

    const rechazo = await this.swal.textareaTitle("Motivo del rechazo");

    if(rechazo === null || rechazo === undefined ){
      this.swal.info("No completó el Comentario, el turno no se rechazó!");
      return;
    }

    turnoARechazar.estadoTurno = "Rechazado";
    turnoARechazar.comentarioEspecialista = rechazo;
    this.spinner.mostrar();
    this.db.modificarTurno(turnoARechazar)
      .then(()=>{
        this.swal.success("Turno rechazado");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      })
  }

  async finalizarTurno(id: string){

    let turnoAFinalizar = new Turno();
    this.turnos?.forEach( t => {
      if(t.id === id){
        turnoAFinalizar = t;
      }
    });

    turnoAFinalizar.estadoTurno = "Finalizado";
    this.spinner.mostrar();
    this.db.modificarTurno(turnoAFinalizar)
      .then(()=>{
        this.swal.success("Turno finalizado");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      })
  }

  async editarComentarioDiagnostico(id: string){

    debugger;
    let turnoAComentar = new Turno();
    this.turnos?.forEach( t => {
      if(t.id === id){
        turnoAComentar = t;
      }
    });

    const comentario = await this.swal.textareaTitle("Comentario/reseña especialista");
    const diagnostico = await this.swal.textareaTitle("Diagnóstico especialista");

    if(comentario === null || comentario === undefined || diagnostico === null || diagnostico === undefined){
      this.swal.info("No completó el Comentario/reseña y/o Diagnóstico, el turno no se realizó!");
      return;
    }

    turnoAComentar.estadoTurno = "Realizado";
    turnoAComentar.comentarioEspecialista = comentario;
    turnoAComentar.diagnosticoEspecialista = diagnostico;

    this.spinner.mostrar();
    this.db.modificarTurno(turnoAComentar)
      .then(()=>{
        this.swal.success("Turno Realizado");
      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      })

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

  mostrarCalificacion(turno: any){
    if(turno?.calificacionPaciente){
      this.swal.infoTitle(turno?.calificacionPaciente, "Calificación del paciente");
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

  
 

  private dataFilter(turnos: Turno[]){
    let array: DataTurnoEspecialista[] = [];
    let data = <DataTurnoEspecialista>{};
    turnos.forEach( t => {
      data = <DataTurnoEspecialista>{
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

  crearHistoriaClinica(id: string){
    let auxTurno = new Turno();

    this.turnos?.forEach( t => {
      if(t.id === id){
        auxTurno = t;
      }
    });

    this.turnoSeleccionado = auxTurno;

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.DataTurnoEspecialistas.filter = filterValue.trim().toLowerCase();
  }

  mostrarCrearHC(mostrarCrear: boolean){
    this.mostrarCrear = mostrarCrear;
  }

  verHistoria(ver: boolean){
    this.mostrarhc = ver;
  }
}
