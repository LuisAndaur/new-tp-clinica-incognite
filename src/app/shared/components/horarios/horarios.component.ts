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
  styleUrls: ['./horarios.component.scss']
})
export class HorariosComponent {

  form!: FormGroup;
  currentUser!: Especialista;
  dias: Array<string> = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horaSeleccionInicio: Array<number> = [];
  horaSeleccionFinal: Array<number> = [];
  horaInicio: Array<number> = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  horaFinal: Array<number> = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  horaSabadoInicio: Array<number> = [8, 9, 10, 11, 12, 13];
  horaSabadoFinal: Array<number> = [9, 10, 11, 12, 13, 14];
  duracion: Array<number> = [ 30, 60 ];
  horarios!: Horarios;

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

  }


  formInit(){
    this.form = new FormGroup({
      especialidades: new FormControl(this.currentUser.especialidades[0].id, Validators.required),
      dias: new FormControl(1, Validators.required),
      horariosInicio: new FormControl(this.horaSeleccionInicio[0], Validators.required),
      horariosFinal: new FormControl(this.horaSeleccionFinal[0], Validators.required),
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

  borrar(){
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
    horarios.dia = this.dias[this.getDias?.value-1];
    horarios.diaNumero = parseInt(this.getDias?.value);
    horarios.horaInicio = parseInt(this.obtenerHorariosInicio?.value);
    horarios.horaFinal = parseInt(this.obtenerHorariosFinal?.value);
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
  get getDias(){
    return this.form.get('dias');
  }
  get obtenerHorariosInicio(){
    return this.form.get('horariosInicio');
  }
  get obtenerHorariosFinal(){
    return this.form.get('horariosFinal');
  }
  get getduracion(){
    return this.form.get('duracion');
  }

}
