import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Especialista } from '../models/especialista.class';
import { Horarios } from '../models/horarios.class';
import { Paciente } from '../models/paciente.class';
import { Turno } from '../models/turno.class';
import { Usuario } from '../models/usuario.class';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private cUsuarios:string = 'usuarios';
  private cEspecialidades:string = 'especialidades';
  private cTurnos:string = 'turnos';

  constructor(private db: Firestore,
              private storage: StorageService) 
  { }

  generarRandom(num: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let result = "";
      for (let i = 0; i < num; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
  
    return result;
  }

  async obtenerUsuario(email:string){
    let usuario = null;
    const querySnapshot = await getDocs(collection(this.db, this.cUsuarios));
    querySnapshot.forEach((doc) =>{

      let user = doc.data();

      if(user['email'] == email){
        usuario = user;
      }

    });

    return usuario;
  }

  obtenerUsuarios() {
    const usuariosRef = collection(this.db, this.cUsuarios);
    const q = query(usuariosRef, orderBy('tipo', 'asc'));
    return collectionData(q,{ idField: 'id' }) ;
  }

  actualizarUsuario(user: Usuario): Promise<void> {

    const userRef = doc(collection(this.db, this.cUsuarios), user.id);
    return updateDoc(userRef, {
      ...user,
    });
  }
  
  async guardarPaciente(paciente: Paciente){

    await this.storage.guardarImagen(paciente.img).then( () =>{

      this.storage.obtenerImagen('images/' + paciente.img['name']).then(getImg1 => paciente.img = getImg1);

      this.storage.guardarImagen(paciente.img2).then( () =>{

        this.storage.obtenerImagen('images/' + paciente.img2['name']).then(getImg2 =>{
            paciente.img2 = getImg2

            const userRef = doc(collection(this.db, this.cUsuarios), paciente.id);
            return setDoc(userRef, {...paciente});
            
          });
      });
    })
  }

  async guardarEspecialista(especialista: Especialista){

    await this.storage.guardarImagen(especialista.img).then( () =>{

      this.storage.obtenerImagen('images/' + especialista.img['name']).then(getImg =>{
          especialista.img = getImg

          const userRef = doc(collection(this.db, this.cUsuarios), especialista.id);
          return setDoc(userRef, {...especialista});
          
        });
    });
  }

  modificarEspecialista(especialista: Especialista, id: string): Promise<void> {
    especialista.img = {... especialista.img}

    especialista.horarios = especialista.horarios.map((horarios: Horarios) => { return { ...horarios } });
    const documento = doc(collection(this.db, this.cUsuarios), id);
    return updateDoc(documento, {
      ...especialista,
    });
  }

  async guardarAdministrador(administrador: Usuario){

    await this.storage.guardarImagen(administrador.img).then( () =>{

      this.storage.obtenerImagen('images/' + administrador.img['name']).then(getImg =>{
          administrador.img = getImg

          const userRef = doc(collection(this.db, this.cUsuarios), administrador.id);
          return setDoc(userRef, {...administrador});
          
        });
    });
  }

  async guardarEspecialidad(especialidad: string) {

    const docRef = await addDoc(collection(this.db, this.cEspecialidades), {especialidad});

    return await updateDoc(docRef, {
      id: docRef.id,
      especialidad: especialidad
    });
  }
  
  obtenerEspecialidades(): Observable<Array<string> | any> {
    const especialidadesRef = collection(this.db, this.cEspecialidades);
    const q = query(especialidadesRef, orderBy('especialidad', 'asc'));
    return collectionData(q,{ idField: 'id' }) ;
  }

  validacionHorarios(horarios: Horarios): [boolean, string] {
    let mensaje = "";

    if(horarios.horaInicio > horarios.horaFinal){
      mensaje = "ERROR: La hora inicial supera la hora final";
    }
    else{
      if(horarios.horaInicio == horarios.horaFinal){
        mensaje = "ERROR: Los horarios son iguales.";
      }
      else{
        const diferenciaHorario = horarios.horaFinal - horarios.horaInicio;
        const minutosTurnos = diferenciaHorario * 60;

        if(horarios.duracion > minutosTurnos){
          mensaje = "ERROR: Supera la duración de 1 solo turno.";
        }
        else{
          return [true, ""];
        }

      }
    }
    return [false, mensaje];
  }

  ordenarHorarios(a: Horarios, b: Horarios) {
    if (a.diaNumero < b.diaNumero) {
      return -1;
    } 
    else {
      if (a.diaNumero > b.diaNumero) {
        return 1;
      } 
      else {
        if (a.horaInicio < b.horaInicio) {
          return -1;
        } 
        else{
          if (a.horaInicio > b.horaInicio) {
            return 1;
          }
          else {
            return 0;
          }
        }
      }
    }
  }

  obtenerTurnos(turnos: Array<Turno>){
    return addDoc(collection(this.db, this.cTurnos), {...turnos});
  }

  obtenerTurno(turno: Turno){
    return addDoc(collection(this.db, this.cTurnos), {...turno});
  }

  existeTurno(dia:number, horaInicio:number, horaFinal:number, horarios:Array<Horarios>) {

    for (let turno of horarios) {

      if (turno.diaNumero === dia) {

        if ((horaInicio >= turno.horaInicio && horaInicio < turno.horaFinal) ||
           (horaFinal > turno.horaInicio && horaFinal <= turno.horaFinal) ||
           (horaInicio <= turno.horaInicio && horaFinal >= turno.horaFinal)) {

            return false;
        }
      }
    }
    return true;
  }

  calcularTurnosPorDuracion(horaInicio:number, horaFinal:number, duracion:number) {
    const diferencia = horaFinal - horaInicio;
    const turnosHora = 60 / duracion;

    return turnosHora * diferencia;
  }

  generarTurnos(horaInicio:number, horaFinal:number, duracion:number) : Array<Turno>{
    const turnos = [];

    let cantidad = this.calcularTurnosPorDuracion(horaInicio, horaFinal, duracion);

    if(duracion == 30){

      let flag = false;
      horaFinal = horaInicio;
  
      for(let i = 0; i < cantidad; i++) {
  
        flag = !flag;
        if ( i > 0 ) {
          if ( i % 2 == 0 ) {
            horaInicio++;
          } 
          else {
            horaFinal++;
          }
        }
  
        const turno = new Turno();  
        turno.horaInicio = `${horaInicio}:${flag?'00':'30'}`;
        turno.horaFinal = `${horaFinal}:${!flag?'00':'30'}`;
        turno.duracion = duracion;
  
        turnos.push(turno);
      }
    }
    else{
      for(let i = 0; i < cantidad; i++) {

        const turno = new Turno();
        turno.horaInicio = `${horaInicio}:00`;
        turno.horaFinal = `${horaInicio+1}:00`;
        turno.duracion = duracion;
  
        turnos.push(turno);
        horaInicio++;
      }
    }
    return turnos;
  }

  calcularProyeccionTurnos(numeroDeSemanas: number = 5, diaSemana: number = new Date().getDate()) {

    if(numeroDeSemanas<1){
      numeroDeSemanas = 1;
    }

    const fechas = [];
    const fechaActual = new Date();
    const diaActual = fechaActual.getDay();
    let diferenciaDias = diaSemana - diaActual;

    if (diferenciaDias < 0) {
      diferenciaDias += 7;
    }

    const primerFecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate() + diferenciaDias);

    for (let i = 0; i < numeroDeSemanas; i++) {
      const fecha = new Date(primerFecha.getFullYear(), primerFecha.getMonth(), primerFecha.getDate() + (7 * i));
      fechas.push(fecha);
    }

    return fechas;
  }

  proyectarTurnos(currentUser: Especialista, turnos: Array<Turno>, diaSemana: number = new Date().getDate(), cantidadDeSemanas: number = 5) : Array<Turno> {
    const proximosDias = this.calcularProyeccionTurnos(cantidadDeSemanas, diaSemana);

    return proximosDias.map(fecha=>{
      return turnos.map(turno=>{

        const fi = new Date(fecha);
        const xi = turno.horaInicio.split(":");
        fi.setHours(parseInt(xi[0]));
        fi.setMinutes(parseInt(xi[1]));

        const ff = new Date(fecha)
        const xf = turno.horaFinal.split(":");
        ff.setHours(parseInt(xf[0]));
        ff.setMinutes(parseInt(xf[1]));

        const _turno = JSON.parse(JSON.stringify(turno));

        _turno.especialista = currentUser;
        _turno.fecha = fi.toLocaleDateString('es');
        _turno.fechaInicio = fi.getTime();
        _turno.fechaFinal = ff.getTime();

        return _turno;
      });
    }) as any;
  }

  
}
