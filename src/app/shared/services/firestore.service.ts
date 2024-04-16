import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad.class';
import { Especialista } from '../models/especialista.class';
import { Horarios } from '../models/horarios.class';
import { LogIngresos } from '../models/log-ingresos.class';
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
  private cRegistrosIngresos:string = 'registro-ingreso';
  usuarios!: Observable<any[]>;

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
    let usuario = new Usuario();
    const querySnapshot = await getDocs(collection(this.db, this.cUsuarios));
    querySnapshot.forEach((doc) =>{

      let user = doc.data();

      if(user['email'] == email){
        usuario.id = user['id'];
        usuario.nombre = user['nombre'];
        usuario.apellido = user['apellido'];
        usuario.email = user['email'];
        usuario.edad = user['edad'];
        usuario.estado = user['estado'];
        usuario.dni = user['dni'];
        usuario.tipo = user['tipo'];
        usuario.fechaRegistro = user['fechaRegistro'];
        usuario.img = user['img'];
      }

    });

    return usuario;
  }

  async obtenerPaciente(email:string){
    let paciente = new Paciente();
    const querySnapshot = await getDocs(collection(this.db, this.cUsuarios));
    querySnapshot.forEach((doc) =>{

      let user = doc.data();

      if(user['email'] == email){
        paciente.id = user['id'];
        paciente.nombre = user['nombre'];
        paciente.apellido = user['apellido'];
        paciente.email = user['email'];
        paciente.edad = user['edad'];
        paciente.estado = user['estado'];
        paciente.dni = user['dni'];
        paciente.tipo = user['tipo'];
        paciente.fechaRegistro = user['fechaRegistro'];
        paciente.obraSocial = user['obraSocial'];
        paciente.img = user['img'];
        paciente.img2 = user['img2'];
      }

    });

    return paciente;
  }

  async obtenerEspecialista(email:string){
    let especialista = new Especialista();
    const querySnapshot = await getDocs(collection(this.db, this.cUsuarios));
    querySnapshot.forEach((doc) =>{

      let user = doc.data();

      if(user['email'] == email){
        especialista.id = user['id'];
        especialista.nombre = user['nombre'];
        especialista.apellido = user['apellido'];
        especialista.email = user['email'];
        especialista.edad = user['edad'];
        especialista.estado = user['estado'];
        especialista.dni = user['dni'];
        especialista.tipo = user['tipo'];
        especialista.fechaRegistro = user['fechaRegistro'];
        especialista.especialidades = user['especialidades'];
        especialista.img = user['img'];
        especialista.horarios = user['horarios'];
      }

    });

    return especialista;
  }

  async obtenerRegistrosIngresos() : Promise<Array<LogIngresos>>{
    let logIngresos = Array<LogIngresos>();
    const querySnapshot = await getDocs(collection(this.db, this.cRegistrosIngresos));

    for(let i = 0; i < querySnapshot.size; i++){
      let datos = querySnapshot.docs[i].data();
      let nuevoLog = new LogIngresos();
      nuevoLog.email = datos['email'];
      nuevoLog.fecha = datos['fecha'];
      logIngresos.push(nuevoLog);
    }
    return logIngresos;
  }

  async obtenerLasEspecialidades() : Promise<Array<Especialidad>>{
    let listaEspecialidades = Array<Especialidad>();
    const querySnapshot = await getDocs(collection(this.db, this.cEspecialidades));

    for(let i = 0; i < querySnapshot.size; i++){
      let datos = querySnapshot.docs[i].data();
      let auxEspecialidad = new Especialidad();
      auxEspecialidad.especialidad = datos['especialidad'];
      auxEspecialidad.id = datos['id'];
      listaEspecialidades.push(auxEspecialidad);
    }
    return listaEspecialidades;
  }

  async obtenerLosEspecialistas() : Promise<Array<Especialista>>{
    let listaEspecialistas = Array<Especialista>();
    const querySnapshot = await getDocs(collection(this.db, this.cUsuarios));

    for(let i = 0; i < querySnapshot.size; i++){
      let datos = querySnapshot.docs[i].data();

      if(datos['tipo'] == 'especialista'){
        let auxEspecialista = new Especialista();
        auxEspecialista.id = datos['id'];
        auxEspecialista.nombre = datos['nombre'];
        auxEspecialista.apellido = datos['apellido'];
        auxEspecialista.edad = datos['edad'];
        auxEspecialista.email = datos['email'];
        auxEspecialista.dni = datos['dni'];
        auxEspecialista.especialidades = datos['especialidades'];
        auxEspecialista.estado = datos['estado'];
        auxEspecialista.fechaRegistro = datos['fechaRegistro'];
        auxEspecialista.horarios = datos['horarios'];
        auxEspecialista.tipo = datos['tipo'];

        listaEspecialistas.push(auxEspecialista);

      }
    }
    return listaEspecialistas;
  }

  async obtenerPacientes() : Promise<Array<Paciente>>{
    let listaPacientes = Array<Paciente>();
    const querySnapshot = await getDocs(collection(this.db, this.cUsuarios));

    for(let i = 0; i < querySnapshot.size; i++){
      let datos = querySnapshot.docs[i].data();

      if(datos['tipo'] == 'paciente'){
        let auxPaciente = new Paciente();
        auxPaciente.id = datos['id'];
        auxPaciente.nombre = datos['nombre'];
        auxPaciente.apellido = datos['apellido'];
        auxPaciente.edad = datos['edad'];
        auxPaciente.email = datos['email'];
        auxPaciente.dni = datos['dni'];
        auxPaciente.obraSocial = datos['obraSocial'];
        auxPaciente.estado = datos['estado'];
        auxPaciente.fechaRegistro = datos['fechaRegistro'];
        auxPaciente.tipo = datos['tipo'];

        listaPacientes.push(auxPaciente);

      }
    }
    return listaPacientes;
  }

  async obtenerLosTurnos() : Promise<Array<Turno>>{
    let listaTurnos = Array<Turno>();
    const querySnapshot = await getDocs(collection(this.db, this.cTurnos));

    for(let i = 0; i < querySnapshot.size; i++){
      let datos = querySnapshot.docs[i].data();

      let auxTurno = new Turno();
      auxTurno.id = datos['id'];
      auxTurno.paciente = datos['paciente'];
      auxTurno.especialista = datos['especialista'];
      auxTurno.especialidad = datos['especialidad'];
      auxTurno.historiaClinica = datos['historiaClinica'];
      auxTurno.estadoTurno = datos['dni'];
      auxTurno.fecha = datos['fecha'];
      auxTurno.fechaInicio = datos['fechaInicio'];
      auxTurno.fechaFinal = datos['fechaFinal'];
      auxTurno.duracion = datos['duracion'];

      listaTurnos.push(auxTurno);
    }
    return listaTurnos;
  }


  obtenerLosRegistrosIngresos() {
    const registroRef = collection(this.db, this.cRegistrosIngresos);
    const q = query(registroRef, orderBy('fecha', 'asc'));
    return collectionData(q) as Observable<Array<LogIngresos>> ;
  }

  obtenerUsuarios() {
    const usuariosRef = collection(this.db, this.cUsuarios);
    const q = query(usuariosRef, orderBy('tipo', 'asc'));
    return collectionData(q,{ idField: 'id' }) ;
  }

  obtenerUsuariosPorFiltro(clave:string, valor: string) {
    const colleccionRef = collection(this.db, this.cUsuarios);
    const q = query(colleccionRef, where(clave, '==', valor));
    return collectionData(q, { idField: 'id' });
  }

  obtenerUsuarioPorEmail(email:string){
    let usuario = null;
    this.usuarios.forEach((item:any) => {
      if (item.email === email) {
        usuario = item;
      }
    });
    return usuario;
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

    especialista.horarios = especialista.horarios.map((horarios: Horarios) => { return { ...horarios } });
    const documento = doc(collection(this.db, this.cUsuarios), id);
    return updateDoc(documento, {
      id: especialista.id,
      fechaRegistro: especialista.fechaRegistro,
      nombre: especialista.nombre,
      apellido: especialista.apellido,
      edad: especialista.edad,
      dni: especialista.dni,
      email: especialista.email,
      img: especialista.img,
      tipo: especialista.tipo,
      estado: especialista.estado,
      especialidades: especialista.especialidades,
      horarios: especialista.horarios
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

    const docRef = await addDoc(collection(this.db, this.cEspecialidades), {id: '', especialidad: especialidad});

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
    return addDoc(collection(this.db, this.cTurnos), 
    {
      id: turno.id,
      fecha: turno.fecha,
      horaInicio: turno.horaInicio,
      horaFinal: turno.horaFinal,
      duracion: turno.duracion,
      fechaInicio: turno.fechaInicio,
      fechaFinal: turno.fechaFinal,
      estadoTurno: turno.estadoTurno,
      paciente: turno.paciente,
      encuestaPaciente: turno.encuestaPaciente,
      calificacionPaciente: turno.calificacionPaciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      comentarioEspecialista: turno.comentarioEspecialista,
      diagnosticoEspecialista: turno.diagnosticoEspecialista,
      comentarioAdministrador: turno.comentarioAdministrador,
      historiaClinica: turno.historiaClinica
    });
  }

  obtenerTurnosCompletos() {
    const turnosRef = collection(this.db, this.cTurnos);
    const q = query(turnosRef, where('estadoTurno', '!=', 'Libre'));
    return collectionData(q,{ idField: 'id' }) ;
  }

  obtenerTurnosPaciente(email: string) {
    const turnosRef = collection(this.db, this.cTurnos);
    const q = query(turnosRef, where('estadoTurno', '!=', 'Libre'), where('paciente.email', '==', email));
    return collectionData(q,{ idField: 'id' }) ;
  }

  obtenerTurnosEspecialista(id: string) {
    const turnosRef = collection(this.db, this.cTurnos);
    const q = query(turnosRef, where('estadoTurno', '!=', 'Libre'), where('especialista.id', '==', id));
    return collectionData(q,{ idField: 'id' }) ;
  }

  obtenerTurnosEspecialistaAtendidos(id: string) {
    const estados : Array<string> = ['Libre', 'Solicitado', 'Cancelado'];
    const turnosRef = collection(this.db, this.cTurnos);
    const q = query(turnosRef, where('estadoTurno', 'not-in', estados), where('especialista.id', '==', id));
    return collectionData(q,{ idField: 'id' }) ;
  }

  async obtenerTurnosDeEstadoPorRangoDeFecha(estado:string, fechaInicio: number, fechaFinal: number): Promise<Array<Turno>> {  
    const turnosRef = collection(this.db, this.cTurnos);
    const q = query(turnosRef, 
      where('fechaInicio','>=', fechaInicio),
      where('fechaInicio','<=', fechaFinal),
      where('estadoTurno','==', estado),
      orderBy('fechaInicio', 'asc'),
    );
  
    const snapshot = await getDocs(q);
    const turnos: Array<Turno> = [];
  
    snapshot.forEach(doc => {
      turnos.push(doc.data() as Turno);
    });
  
    return turnos;
  }

  obtenerTurnosPorEspecialistaYEspecialidad(idEspecialista: string, especialidad: string){
    debugger;
    const posibilidades : Array<string> = ['Libre'];

    const q = query(collection(this.db, this.cTurnos),
      where('especialista.id', '==', idEspecialista),
      where('especialidad.especialidad', '==', especialidad),
      where('estadoTurno', 'in', posibilidades),
      );
    return collectionData(q, { idField: 'id' });
  }

  obtenerTurnosSegunEstado(estado: Array<string>, match : 'not-in' | 'in'){  
    const q = query(collection(this.db, this.cTurnos), 
      where('estadoTurno',match, estado));

    return collectionData(q)  as Observable<Array<Turno>>;
  }

  modificarTurno(turno:Turno){

    if(turno.historiaClinica){
      turno.historiaClinica = {... turno.historiaClinica}
    }

    if(turno.encuestaPaciente){
      turno.encuestaPaciente = {... turno.encuestaPaciente}
    }

    const documento = doc(collection(this.db, this.cTurnos), turno.id);
    return updateDoc(documento, {
      ...turno
    });
  }

  existeTurno(dia:number, horaInicio:number, horaFinal:number, horarios:Array<Horarios>, idEspecialidad: number) {

    debugger;
    for (let turno of horarios) {

      if (turno.diaNumero === dia) {

        if ((horaInicio >= turno.horaInicio && horaInicio < turno.horaFinal) ||
           (horaFinal > turno.horaInicio && horaFinal <= turno.horaFinal)) {

             return true;

        }
      }
    }
    return false;
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

  fechaCompleta(date: number): string {

    let inputDate = new Date();
    inputDate.setTime(date);

    if (!inputDate) {
      return '';
    }

    const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

    const diaSemana = diasSemana[inputDate.getDay()];
    const diaMes = inputDate.getDate();
    const mes = meses[inputDate.getMonth()];
    const ano = inputDate.getFullYear();

    return `${diaSemana}, ${diaMes} DE ${mes} DE ${ano}`;
  }

  
}
