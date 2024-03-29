import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Especialista } from '../../models/especialista.class';
import { Horarios } from '../../models/horarios.class';
import { Turno } from '../../models/turno.class';
import { FirestoreService } from '../../services/firestore.service';
import { LocalstorageService } from '../../services/localstorage.service';
import { SpinnerService } from '../../services/spinner.service';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('500ms', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('500ms', style({ transform: 'translateY(-100%)' }))
      ])
    ]),
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class HorariosComponent {

  form!: FormGroup;
  currentUser!: Especialista;
  dia: Array<string> = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horaSeleccionInicio: Array<number> = [];
  horaSeleccionFinal: Array<number> = [];
  horaInicio: Array<number> = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  horaFinal: Array<number> = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  horaSabadoInicio: Array<number> = [8, 9, 10, 11, 12, 13];
  horaSabadoFinal: Array<number> = [9, 10, 11, 12, 13, 14];
  duracion: Array<number> = [ 30, 60 ];
  horarios!: Horarios;
  displayedColumns: string[] = ['especialidad', 'dia', 'inicio', 'fin', 'duracion'];
  misHorarios: Array<Horarios> = [];

  constructor(
        private localStorage: LocalstorageService,
        private swal: SwalService,
        private db: FirestoreService,
        private spinner: SpinnerService){}

  ngOnInit(): void {
    this.currentUser = this.localStorage.getItem('usuario');
    console.log(this.currentUser);
    this.ordenarHorarios();

    this.asignarDia("Lunes");
    this.formInit();

    this.misHorarios = this.currentUser.horarios;

  }


  formInit(){
    this.form = new FormGroup({
      especialidades: new FormControl(this.currentUser.especialidades[0].id, Validators.required),
      dia: new FormControl(1, Validators.required),
      horaInicio: new FormControl(this.horaSeleccionInicio[0], Validators.required),
      horaFinal: new FormControl(this.horaSeleccionFinal[0], Validators.required),
      duracion: new FormControl(this.duracion[0], Validators.required),
    });
  }

  submit(){
    debugger;
    if(this.form.valid){

      const horarios = this.obtenerHorarios();
      const respuesta = this.db.validacionHorarios(horarios)
      if(respuesta[0]) {
        if(!this.currentUser?.horarios){
          this.currentUser.horarios = [];
        }
        if(this.db.existeTurno(horarios.diaNumero,horarios.horaInicio,horarios.horaFinal,this.currentUser.horarios)){

          const turnos = this.db.generarTurnos(horarios.horaInicio,horarios.horaFinal,horarios.duracion);
          const turnosProyectados = this.db.proyectarTurnos(this.currentUser, turnos,horarios.diaNumero);
          this.actualizarEspecialista(horarios,turnosProyectados);
          this.misHorarios = this.currentUser.horarios;
        }
        else{
          this.swal.error("Ya existe este turno!");
        }
      } 
      else {
        this.swal.error(respuesta[1]);
      }
    }
    else{
      this.swal.info("Formulario no válido!");
    }
  }

  cambioDeDia(event:any){
    this.asignarDia(event.target.value);
  }

  limpiar(){
    this.form.reset();
  }

  private asignarDia(dia: string){
    if(dia == 'Sábado'){
      this.asignarHorarioSabado();
    }else{
      this.asignarHorario();
    }
  }

  private asignarHorario(){
    this.horaSeleccionInicio = this.horaInicio;
    this.horaSeleccionFinal = this.horaFinal;
  }

  private asignarHorarioSabado(){
    this.horaSeleccionInicio = this.horaSabadoInicio;
    this.horaSeleccionFinal = this.horaSabadoFinal;
  }

  private obtenerHorarios(): Horarios{
    const horarios = new Horarios();
    horarios.dia = this.dia[this.getdia?.value-1];
    horarios.diaNumero = parseInt(this.getdia?.value);
    horarios.horaInicio = parseInt(this.obtenerhoraInicio?.value);
    horarios.horaFinal = parseInt(this.obtenerhoraFinal?.value);
    horarios.duracion = parseInt(this.getduracion?.value);
    const especialidad = this.currentUser.especialidades.filter(e => e.id == this.getEspecialidades?.value)[0];
    horarios.especialidad = especialidad;
    return horarios;
  }

  private ordenarHorarios() {
    this.currentUser?.horarios?.sort(this.db.ordenarHorarios);
  }


  private actualizarEspecialista(horarios: Horarios, turnos: Array<Turno>) {
    this.currentUser.horarios.push(horarios);
    this.spinner.mostrar();
    this.db.modificarEspecialista(this.currentUser,this.currentUser.id)
      .then(()=>{
        this.localStorage.setItem('usuario',this.currentUser);
        this.ordenarHorarios();
        this.swal.success("Se guardo el horario");

        turnos.flat().forEach((turno,index) => {
          turno.especialista = this.currentUser;
          turno.especialidad = horarios.especialidad;
          this.db.obtenerTurno(turno)
            .then(()=>{

            })
            .catch((e:Error)=>{
              this.swal.error(e.message);
            })
            .finally(()=>{
              if(index == turnos.length -1 ){
                this.spinner.ocultar();
                this.swal.success("Se generaron los turnos");
              }
            })
        });

      })
      .catch((e:Error)=>{
        this.swal.error(e.message);
        this.spinner.ocultar();
      })
  }


  get getEspecialidades(){
    return this.form.get('especialidades');
  }
  get getdia(){
    return this.form.get('dia');
  }
  get obtenerhoraInicio(){
    return this.form.get('horaInicio');
  }
  get obtenerhoraFinal(){
    return this.form.get('horaFinal');
  }
  get getduracion(){
    return this.form.get('duracion');
  }

}
