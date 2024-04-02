import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Especialidad } from 'src/app/shared/models/especialidad.class';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { PdfService } from 'src/app/shared/services/pdf.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { take } from 'rxjs';
import { Turno } from 'src/app/shared/models/turno.class';
import { SwalService } from 'src/app/shared/services/swal.service';
import { Especialista } from 'src/app/shared/models/especialista.class';
import { LogIngresos } from 'src/app/shared/models/log-ingresos.class';

export interface IUsuarioCantidad {
  email: string;
  cantidad: number;
}

export interface IVisitaCantidad {
  tipo: string;
  cantidad: number;
}

export class ILogIngreso{
  fecha!: number;
  nombre!: string;
  apellido!: string;
  email!: string;
  tipo!: string;
}

export interface ITurnoEspecialidadCantidad{
  especialidad: string;
  cantidad: number;
}

export interface ITurnoDiaCantidad{
  dia: string;
  cantidad: number;
}

export interface ITurnoEspecialistaCantidad{
  idEspecialista: string;
  nombre: string;
  apellido: string;
  cantidad: number;
}

@Component({
  selector: 'app-graficos-y-estadisticas',
  templateUrl: './graficos-y-estadisticas.component.html',
  styleUrls: ['./graficos-y-estadisticas.component.scss']
})
export class GraficosYEstadisticasComponent implements OnInit {

  labelChart = new Array<string>();
  chart:any;
  logsDeIngresos: Array<any> = [];
  usuario:any;
  verGrafico: boolean = false;
  dias: Array<string> = ["Domingo", "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  listaLogsDeIngresos = new Array<ILogIngreso>;
  mostrarUsuario:boolean = false;
  listaEspecialistas: Array<Especialista> = [];
  listaEspecialidades: Array<Especialidad> = [];
  listaTurnosSolicitados: Array<Turno> = [];
  listaTurnosFinalizados: Array<Turno> = [];
  turnos: Array<any> | null = [];
  private contadorRegistros: Array<IUsuarioCantidad> = [];
  private contadorTurnoPorEspecialidad: Array<ITurnoEspecialidadCantidad> = [];
  private contadorTurnoPorDia: Array<ITurnoDiaCantidad> = [];
  private contadorSolicitadoPorEspecialista: Array<ITurnoEspecialistaCantidad> = [];
  private contadorFinalizadoPorEspecialista: Array<ITurnoEspecialistaCantidad> = [];
  fechaDesde = new Date();
  fechaHasta = new Date();
  opcion:number = -1;
  contadorAdministrador: number = 0;
  contadorEspecialista: number = 0;
  contadorPaciente: number = 0;
  usuariosColumnas: string[] = ['fecha', 'nombre', 'apellido', 'email', 'tipo'];
  dataUsuarios: Array<any> = [];


  constructor(private db: FirestoreService,
              private spinner: SpinnerService,
              private swal: SwalService,
              private excel: ExcelService) { 
  }

  ngOnInit(): void {
    this.spinner.mostrar();
    this.cargarLogIngresos();

    this.cargarTurnos();

    this.cargarEspecialidades();

    this.cargarEspecialistas();

    
  }

  private async cargarLogIngresos(){

    await this.db.obtenerRegistrosIngresos()
    .then((logs)=>{
      this.logsDeIngresos = logs;
      debugger;
      console.log('logsDeIngresos: ',this.logsDeIngresos);

      this.db.obtenerUsuarios().subscribe((user) => {

        user.forEach((u) => {
          logs.forEach((l) => {
            if(l.email == u['email']){
              let auxLog = new ILogIngreso;
              auxLog.fecha = new Date(l.fecha).getTime();
              auxLog.nombre = u['nombre'];
              auxLog.apellido = u['apellido'];
              auxLog.email = l.email;
              auxLog.tipo = u['tipo'];

              this.listaLogsDeIngresos.push(auxLog);

              if(u['tipo'] == 'administrador')
                this.contadorAdministrador++

              if(u['tipo'] == 'especialista')
                this.contadorEspecialista++

              if(u['tipo'] == 'paciente')
                this.contadorPaciente++
            }
          });
        })
        
      })
      

      this.dataUsuarios = this.listaLogsDeIngresos.sort((a, b) => new Date(b.fecha).getTime() - (new Date(a.fecha)).getTime());
    }).finally(()=> this.spinner.ocultar());
  }

  private async cargarEspecialistas(){

    await this.db.obtenerLosEspecialistas()
    .then((e)=>{
      this.listaEspecialistas = e;
      console.log('listaEspecialistas: ',this.listaEspecialistas);
    }).finally(()=> this.spinner.ocultar());;
  }

  private async cargarEspecialidades(){

    await this.db.obtenerLasEspecialidades()
    .then((e)=>{
      this.listaEspecialidades = e;
      console.log('listaEspecialidades: ',this.listaEspecialidades);
    }).finally(()=> this.spinner.ocultar());;
  }

  private cargarTurnos(){

    this.db.obtenerTurnosSegunEstado(['Libre'],'not-in')
    .pipe(take(1))
      .subscribe((t) => {
      this.turnos = t;
      console.log('turnos: ',this.turnos);
      this.spinner.ocultar()
    });
  }

  mostrarLogIngresos(){

    this.opcion = 1;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.contadorRegistros = this.obtenerCantidadPorUsuario(this.logsDeIngresos);
    this.chartLogsDeIngresos();
  }

  mostrarVisitas(){

    this.opcion = 6;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    // this.contadorRegistros = this.obtenerCantidadPorUsuario(this.logsDeIngresos);
    this.chartVisitas();
  }

  turnosPorEspecialidad(){

    this.opcion = 2;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.contadorTurnoPorEspecialidad = this.obtenerCantidadTurnosPorEspecialidad(this.turnos);
    this.chartTurnosPorEspecialidad();
  }

  setearOpcion(index:number){
    this.verGrafico = false;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.opcion = index;
  }

  buscar(){
    if(this.opcion == 4){
      if(this.chart instanceof Chart){
        this.chart.destroy();
      }

      this.cantidadTurnosSolicitados();
    }
    else{  
      if(this.opcion == 5){
        if(this.chart instanceof Chart){
          this.chart.destroy();
        }

        this.cantidadTurnosFinalizados();
      }
    }
  }

  cantidadTurnosPorDia(){
    this.opcion = 3;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    const dias = this.obtenerDiasDeLaSemana(this.turnos as Turno[]);
    // console.log('DIAS: ', dias);
    this.contadorTurnoPorDia = this.obtenerCantidadTurnosPorDia(dias);
    // console.log('DIAS TURNOS: ', this.contadorTurnoPorDia);
    this.chartTurnosPorDia();
  }

  cantidadTurnosSolicitados(){

    
    if(this.validarFecha()){
      this.verGrafico = true;

      let desde = this.parsearFecha(this.fechaDesde);
      let hasta = this.parsearFecha(this.fechaHasta);
  
      this.db.obtenerTurnosDeEstadoPorRangoDeFecha('Solicitado', desde, hasta)
      .then(turnosSolicitados => {
  
        this.listaTurnosSolicitados = turnosSolicitados;

        const countEspecialistas = this.listaTurnosSolicitados.map(t => t.especialista.id);

        this.contadorSolicitadoPorEspecialista = this.obtenerCantidadEspecialista(countEspecialistas);
        this.chartTurnosSolicitadosPorEspecialista();
        this.cargarNombresEspecialista(this.contadorSolicitadoPorEspecialista);
      })
      .catch(error => {
        this.swal.warning('No hay turnos solicitados en ese rango de fechas')
        console.error("No hay turnos ", error);
      });
    }
    else{
      this.swal.error('Fechas no válidas!');
    }
  }

  cantidadTurnosFinalizados(){

    if(this.validarFecha()){

      this.verGrafico = true;

      let desde = this.parsearFecha(this.fechaDesde);
      let hasta = this.parsearFecha(this.fechaHasta);
  
      this.db.obtenerTurnosDeEstadoPorRangoDeFecha('Finalizado', desde, hasta)
      .then(turnosFinalizados => {
  
        this.listaTurnosFinalizados = turnosFinalizados;

        const countEspecialistas = this.listaTurnosFinalizados.map(t => t.especialista.id);

        this.contadorFinalizadoPorEspecialista = this.obtenerCantidadEspecialista(countEspecialistas);
        this.chartTurnosFinalizadosPorEspecialista();
        this.cargarNombresEspecialista(this.contadorFinalizadoPorEspecialista);
      })
      .catch(error => {
        this.swal.warning('No hay turnos finalizados en ese rango de fechas')
        console.error("No hay turnos ", error);
      });
    }
    else{
      this.swal.error('Fechas no válidas!');
    }
  }

  verUsuario(){
    this.mostrarUsuario = !this.mostrarUsuario;
  }

  private obtenerCantidadPorUsuario(data: any):Array<IUsuarioCantidad>{
    return data.reduce((accumulator:any, item:any) => {
      debugger;
      const existingItem = accumulator.find((entry:any) => {
        return entry.email === item.email
      });
      if (existingItem) {
        existingItem.cantidad++;
      } else {
        accumulator.push({ cantidad: 1, email: item.email });
      }
      return accumulator;
    }, []);
  }

  private obtenerCantidadTurnosPorEspecialidad(data: any):Array<ITurnoEspecialidadCantidad>{
    return data.reduce((accumulator:any, item:any) => {
      const existingItem = accumulator.find((entry:any) => {
         return entry.especialidad === item.especialidad.especialidad });
      if (existingItem) {
        existingItem.cantidad++;
      } else {
        accumulator.push({ cantidad: 1, especialidad: item.especialidad.especialidad });
      }
      return accumulator;
    }, []);
  }

  private obtenerDiasDeLaSemana(data: Array<Turno>):Array<any> {
    return data.map(turno => {return {dia:this.obtenerDiasEnLetras(new Date(turno.fechaInicio).getDay())}});
  }

  private obtenerDiasEnLetras(dia:number):string{
    if(dia>0 && dia<7){
      return this.dias[dia];
    }
    return 'Lunes';
  }

  private obtenerCantidadTurnosPorDia(data: any):Array<ITurnoDiaCantidad>{
    return data.reduce((accumulator:any, item:any) => {
      const existingItem = accumulator.find((entry:any) => {
        return entry.dia === item.dia
      });
      if (existingItem) {
        existingItem.cantidad++;
      } else {
        accumulator.push({ cantidad: 1, dia: item.dia });
      }
      return accumulator;
    }, []);
  }

  private obtenerCantidadEspecialista(data: Array<string>): Array<ITurnoEspecialistaCantidad>{
    let counts :any = {};
    data.forEach((item:any) => {
      counts[item] = (counts[item] || 0) + 1;
    });

    return Object.entries(counts).map(([idEspecialista, cantidad]) => {
      return { idEspecialista, cantidad };
    }) as Array<ITurnoEspecialistaCantidad>;
  }

  private validarFecha():boolean{

    let fechaDesde = this.fechaDesde.toString().split('-');
    let fechaHasta = this.fechaHasta.toString().split('-');
    let dateFechaDesde = new Date(Number.parseInt(fechaDesde[0]), Number.parseInt(fechaDesde[1]) - 1, Number.parseInt(fechaDesde[2]));
    let dateFechaHasta = new Date(Number.parseInt(fechaHasta[0]), Number.parseInt(fechaHasta[1]) - 1, Number.parseInt(fechaHasta[2]));

    console.log(dateFechaDesde);
    console.log(dateFechaHasta);

    if(dateFechaDesde > dateFechaHasta || dateFechaHasta < dateFechaDesde ){
      return false;
    }

    return true;
  }

  private parsearFecha(fecha: Date): number{

    let auxFecha = fecha.toString().split('-');
    let fechaDate = new Date(Number.parseInt(auxFecha[0]), Number.parseInt(auxFecha[1]) - 1, Number.parseInt(auxFecha[2]));

    return fechaDate.getTime();
  }

  actualizarFecha(evento:any, valor:string){

    if(valor == 'desde'){
      this.fechaDesde = evento;
    }
    else{
      this.fechaHasta = evento;
    }
  }

  
  

  private chartLogsDeIngresos(){
    const emails = this.contadorRegistros.map(e=> e.email);
    const cantidad = this.contadorRegistros.map(e=> e.cantidad);
  
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'doughnut',
      data: {
        labels: emails,
        datasets: [{
          label: 'Turnos por especialidad',
          data: cantidad,
          borderWidth: 1,
        }]
      },
    });
  }

  private chartVisitas(){

    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'doughnut',
      data: {
        labels: ['Administradores', 'Especialistas', 'Pacientes'],
        datasets: [{
          label: 'Turnos por especialidad',
          data: [this.contadorAdministrador, this.contadorEspecialista, this.contadorPaciente],
          borderWidth: 1,
        }]
      },
    });
  }

  private chartTurnosPorEspecialidad(){
    const especialidades = this.contadorTurnoPorEspecialidad.map(e=> e.especialidad);
    const cantidad = this.contadorTurnoPorEspecialidad.map(e=> e.cantidad);
  
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'pie',
      data: {
        labels: especialidades,
        datasets: [{
          label: 'Turnos por especialidad',
          data: cantidad,
          borderWidth: 1,
        }]
      },
    });
  }

  private chartTurnosPorDia(){
    const dias = this.contadorTurnoPorDia.map(e=> e.dia);
    const cantidad = this.contadorTurnoPorDia.map(e=> e.cantidad);
  
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: dias,
        datasets: [{
          label: 'Turnos por día',
          data: cantidad,
          borderWidth: 1,
        }]
      },
    });
  }

  private chartTurnosSolicitadosPorEspecialista(){
    const especialistasSolicitados = this.contadorSolicitadoPorEspecialista.map(e=> {
      const posicion = this.listaEspecialistas.findIndex(_e => _e.id === e.idEspecialista);
      return `${this.listaEspecialistas[posicion].apellido}, ${this.listaEspecialistas[posicion].nombre}`;
    });

    const cantidad = this.contadorSolicitadoPorEspecialista.map(e=> e.cantidad);
  
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: especialistasSolicitados,
        datasets: [{
          label: `Turnos solicitados por especialistas (Desde ${this.fechaDesde} - Hasta: ${this.fechaHasta})}`,
          data: cantidad,
          borderWidth: 1,
        }]
      },
    });
  }

  private chartTurnosFinalizadosPorEspecialista(){
    const especialistasFinalizados = this.contadorFinalizadoPorEspecialista.map(e=> {
      const posicion = this.listaEspecialistas.findIndex(_e => _e.id === e.idEspecialista);
      return `${this.listaEspecialistas[posicion].apellido}, ${this.listaEspecialistas[posicion].nombre}`;
    });

    const cantidad = this.contadorFinalizadoPorEspecialista.map(e=> e.cantidad);
  
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: especialistasFinalizados,
        datasets: [{
          label: `Turnos solicitados por especialistas (Desde ${this.fechaDesde} - Hasta: ${this.fechaHasta})}`,
          data: cantidad,
          borderWidth: 1,
        }]
      },
    });
  }

  private cargarNombresEspecialista(contador: ITurnoEspecialistaCantidad[]){
    for(let i=0; i < contador.length; i++){
      for (let j = 0; j < this.listaEspecialistas.length; j++) {
        if(contador[i].idEspecialista == this.listaEspecialistas[j].id){
          contador[i].nombre = this.listaEspecialistas[j].nombre;
          contador[i].apellido = this.listaEspecialistas[j].apellido;
        }
        
      }
    }
  }

  descargarExcel(){

    switch(this.opcion){
      case 1:
        this.excel.descargarExcelLogIngresos(this.contadorRegistros, this.setearnombre());
        break;

      case 2:
          this.excel.descargarExcelTurnosPorEspecialidad(this.contadorTurnoPorEspecialidad, this.setearnombre());
          break;

      case 3:
        this.excel.descargarExcelTurnosPorDia(this.contadorTurnoPorDia, this.setearnombre());
        break;

      case 4:
        this.excel.descargarExcelTurnoSolicitados(this.contadorSolicitadoPorEspecialista, this.setearnombre())
        break;

      case 5:
        this.excel.descargarExcelTurnoFinalizados(this.contadorFinalizadoPorEspecialista, this.setearnombre())
        break;

      case 6:
        let visitas: Array<IVisitaCantidad> = [
          { tipo: 'Administrador', cantidad: this.contadorAdministrador},
          { tipo: 'Especialistas', cantidad: this.contadorEspecialista},
          { tipo: 'Paciente', cantidad: this.contadorPaciente}
        ];
        this.excel.descargarExcelVisitas(visitas, this.setearnombre());
        break;
    }
  }

  descargarPDF(): void {

    let nombreArchivo = `${this.setearnombre()}_${this.formatearFecha()}`;

    const DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      const fileWidth = 210;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const fecha = new Date().getTime();
      const titulo = `${this.setearTitulo()}`;
      pdf.text(titulo, 5, 10);
      pdf.setFont('helvetica');
      pdf.setFontSize(12);
      pdf.text(`Fecha: ${this.db.fechaCompleta(fecha)}`, 5, 18.5);
      pdf.addImage(FILEURI, 'PNG', 0, 25, fileWidth, fileHeight);
      pdf.addImage("./../../../assets/logo.png", 'PNG', 185, 3, 16, 16);
      const nombreDeArchivo = nombreArchivo;
      pdf.save(nombreDeArchivo);
    });
  }

  private setearTitulo(){

    let titulo = '';

    switch(this.opcion){
      case 1:
        titulo = 'Logs de ingresos';
        break;

      case 2:
          titulo = 'Turnos por especialidad';
          break;

      case 3:
        titulo = 'Turnos por día';
        break;

      case 4:
        titulo = 'Turnos solicitados por especialista';
        break;

      case 5:
        titulo = 'Turnos finalizados por especialista';
        break;

      case 6:
        titulo = 'Cantidad de visitas que tuvo la clínica';
        break;
    }

    return titulo;
  }

  private setearnombre(){

    let nombre = '';

    switch(this.opcion){
      case 1:
        nombre = 'logs_de_ingresos';
        break;

      case 2:
          nombre = 'turnos_por_especialidad';
          break;

      case 3:
        nombre = 'turnos_por_dia';
        break;

      case 4:
        nombre = 'turnos_solicitados_por_especialista';
        break;

      case 5:
        nombre = 'turnos_finalizados_por_especialista';
        break;

      case 6:
        nombre = 'cantidad_de_visitas';
        break;
    }

    return nombre;
  }

  private formatearFecha() {
    let date = new Date();

    let fecha = date.toLocaleDateString('es-AR');
    let hora = date.toLocaleTimeString('es-AR').split(':');
    return `_${fecha}_${hora[0]}:${hora[1]}:${hora[2]}`;
  }

  private formatearFechaRegistro(date: string) {

    let aux = new Date(date);
    let fecha = aux.toLocaleDateString('es-AR');
    let hora = aux.toLocaleTimeString('es-AR').split(':');
    return `${fecha} - ${hora[0]}:${hora[1]}:${hora[2]}`;
  }
}
