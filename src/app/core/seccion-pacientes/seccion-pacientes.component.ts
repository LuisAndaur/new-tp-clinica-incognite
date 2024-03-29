import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/shared/models/paciente.class';
import { Turno } from 'src/app/shared/models/turno.class';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

export interface PacienteTurnos{
  paciente: Paciente,
  turnos: Turno[];
}

@Component({
  selector: 'app-seccion-pacientes',
  templateUrl: './seccion-pacientes.component.html',
  styleUrls: ['./seccion-pacientes.component.scss']
  
})
export class SeccionPacientesComponent implements OnInit {

  currentUser!: any;
  turnos: Array<any> | null = [];
  pacientes: Array<any> | null = [];
  pacienteTurnos: Array<PacienteTurnos> = [];
  turnoSeleccionado!: Turno;
  mostrarhc: boolean = false;
  emailPacientePadre: string = "";
  idTurnoPadre: string = "";

  constructor(private db: FirestoreService,
              private localStorage: LocalstorageService,
              private spinner: SpinnerService){}

  ngOnInit(): void {

    this.currentUser = this.localStorage.getItem('usuario');

    this.spinner.mostrar();

    this.db.obtenerTurnosEspecialistaAtendidos(this.currentUser.id).subscribe( (t) => {
      this.turnos = t;

      this.db.obtenerUsuariosPorFiltro('tipo', 'paciente').subscribe( p => {
        this.pacientes = p;

        this.pacientes.forEach((auxP) => {
          
          const pacAux = p.filter(x => x.id === auxP.id);
          const tNotLibres = this.turnos!.filter(x => x.estadoTurno != 'Libre');
          const tAux = tNotLibres.filter(x => x.paciente.id === auxP.id && x.especialista.id === this.currentUser.id);
        
          if(tAux.length>0){
            const pacienteTurno: any = {
              paciente: pacAux[0],
              turnos: tAux
            }
    
            this.pacienteTurnos.push(pacienteTurno);

          }

        });

        this.spinner.ocultar();
      });

    });



    console.log('pacientesTurno: ', this.pacienteTurnos);

  }

  mostrarHistoriaClinica(id: string | undefined) {
    debugger;
    let auxTurno = new Turno();
    this.turnos?.forEach( t => {
      if(t.id === id){
        auxTurno = t;
      }
    });

    this.turnoSeleccionado = auxTurno;
    this.idTurnoPadre = id as string;
    this.emailPacientePadre = auxTurno.paciente.email;
    this.mostrarhc = true;
  }

  verHistoria(ver: boolean){
    this.mostrarhc = ver;
  }


}
