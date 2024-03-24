import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Especialidad } from 'src/app/shared/models/especialidad.class';
import { Especialista } from 'src/app/shared/models/especialista.class';
import { Paciente } from 'src/app/shared/models/paciente.class';
import { Turno } from 'src/app/shared/models/turno.class';
import { Usuario } from 'src/app/shared/models/usuario.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import { SwalService } from 'src/app/shared/services/swal.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {

  filtroEspecialidad: string = "";
  filtroEspecialista: Especialista | null = null;
  currentUser!: Paciente | Especialista | Usuario;
  especialistas: Array<Especialista> | null = null;
  especialistasFiltrados: Array<Especialista> | null = null;
  pacientes: Array<Paciente> | null = null;
  especialidades: Array<Especialidad> | null = null;
  turnos : Array<Turno> | null = null;
  unsubTurnos!:  any;
  idUsuario: string = "";
  pacienteElegido: Paciente | null = null;
  filtroEspecialidadesDelEspecialista: Array<Especialidad> | null = null;
  filtroDiasTurnos? : Array<Turno> | null = null;
  filtroHorasTurnos? : Array<Turno> | null = null;
  fechaDelTurno: string = "";

  constructor(
              private router: Router,
              private spinner: SpinnerService,
              private swal: SwalService,
              private localStorage: LocalstorageService,
              private db: FirestoreService){}

  ngOnInit(): void {

    this.spinner.mostrar();
    this.currentUser = this.localStorage.getItem('usuario');

    if(this.currentUser.tipo == 'paciente'){
      this.pacienteElegido = this.currentUser as Paciente;

    }
    else {
      if(this.currentUser.tipo == 'administrador'){

        this.db.obtenerUsuariosPorFiltro("tipo","paciente")
        .subscribe((_usuarios)=>{
          this.pacientes = _usuarios as Array<Paciente>;
        });

      }
      else{
        this.swal.error("Se ha producido un error");
        this.router.navigate(['/error']);
      }
    }

    this.db.obtenerUsuariosPorFiltro("tipo","especialista")
      .subscribe((_usuarios)=>{
        this.especialistas = _usuarios as Array<Especialista>;
      });

    this.db.obtenerEspecialidades()
      .subscribe((_especialidades)=>{

        this.especialidades = _especialidades as Array<Especialidad>;

      });
    this.spinner.ocultar();
  }  

  private obtenerTurnos(){

    let turnosDias: Array<Turno> = [];
    let fechas: Array<string> = [];

    const unsubTurnos = this.db.obtenerTurnosPorEspecialistaYEspecialidad(this.filtroEspecialista!.id,this.filtroEspecialidad)
    .subscribe((_turnos=>{
      unsubTurnos.unsubscribe();
      console.log("TURNOS: ",_turnos);

      const fechaActual = new Date().getTime();
      const fechaAFuturo = new Date();
      fechaAFuturo.setDate(fechaAFuturo.getDate() + 15);
      const fechaLimite = fechaAFuturo.getTime();

      this.turnos = _turnos as Array<Turno>;
      this.turnos = this.turnos
        ?.filter(turno => {
          return turno.fechaFinal < fechaLimite && turno.fechaInicio > fechaActual;
        });
      this.turnos?.sort((a,b)=> a.fechaInicio - b.fechaInicio);

      this.turnos?.forEach(turno => {

        if(!fechas.includes(turno.fecha)){
          fechas.push(turno.fecha);
          turnosDias.push(turno);
        }

      });

      this.filtroDiasTurnos = turnosDias;
      // this.filtroDiasTurnos = Array.from(new Set(diasTurnos));

      console.log("FILTRO DIAS: ", this.filtroDiasTurnos);
    }))

  }

  seleccionarDia(dia: number){

    this.filtroHorasTurnos = null;
    let turnosDias: Array<Turno> = [];

    this.turnos?.forEach(turno => {

      let fecha = new Date(dia);

      if(turno.fecha == fecha.toLocaleDateString('es')){
        this.fechaDelTurno = turno.fecha;
        turnosDias.push(turno);
      }

    });

    this.filtroHorasTurnos = turnosDias;
    this.filtroHorasTurnos?.sort((a,b)=> a.fechaInicio - b.fechaInicio);

    console.log("DIA ELEGIDO: ", dia);
    console.log("FILTRO DIAS: ", this.filtroDiasTurnos);
  }

  seleccionarTurno(turno: Turno) {
    this.spinner.mostrar();

    turno.paciente = this.pacienteElegido!;
    turno.estadoTurno = 'Solicitado';

    this.db.modificarTurno(turno)
      .then(()=>{
        this.turnos = this.turnos?.filter(turno => {
          return turno.estadoTurno == 'Libre' || turno.estadoTurno == 'Cancelado' || turno.estadoTurno == 'Rechazado'
        })!;

        this.swal.success("El turno fue solicitado");
        this.seleccionarDia(turno.fechaInicio);

      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
      })
      .finally(()=>{
        this.spinner.ocultar();
      })
  }

  seleccionarEspecialidad(especialidad: Especialidad){

    this.filtroEspecialidad = especialidad.especialidad;
    this.filtroDiasTurnos = null;
    this.filtroHorasTurnos = null;
    this.turnos = null;
    this.obtenerTurnos();
  }

  seleccionarEspecialista(especialista: Especialista){
    debugger;
    this.filtroEspecialista = especialista;
    this.filtroEspecialidadesDelEspecialista = especialista.especialidades;
  }

  seleccionarPaciente(paciente: Paciente){
    this.pacienteElegido = paciente;
    this.filtroDiasTurnos = null;
    this.filtroHorasTurnos = null;
    this.filtroEspecialidad = "";
    this.filtroEspecialidadesDelEspecialista = null;
  }

  filtrarEspecialistas( especialistas: Array<Especialista> | null){

    this.especialistasFiltrados = [];
    this.filtroEspecialista
    if(especialistas!=null){
      especialistas.forEach( especialista => {
        especialista.especialidades.forEach( especialidad => {
          if(this.filtroEspecialidad == especialidad.especialidad){
            this.especialistasFiltrados?.push(especialista);
          }
        })
      })
    }

    console.log(this.especialistasFiltrados);
    if(this.especialistasFiltrados.length == 0){
      this.especialistasFiltrados = null;
    }
    console.log(this.especialistasFiltrados);
  }

}
