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
import { Paciente } from 'src/app/shared/models/paciente.class';

export interface IUsuarioCantidad {
  email: string;
  cantidad: number;
}

export interface IVisitaCantidad {
  tipo: string;
  cantidad: number;
}

export class IR1{
  fecha!: Date;
  paciente!: string;
  email!: string;
  respuesta!: string;
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
  selector: 'app-informes-encuesta',
  templateUrl: './informes-encuesta.component.html',
  styleUrls: ['./informes-encuesta.component.scss']
})
export class InformesEncuestaComponent implements OnInit {

  labelChart = new Array<string>();
  chart:any;
  logsDeIngresos: Array<any> = [];
  usuario:any;
  verGrafico: boolean = false;
  dias: Array<string> = ["Domingo", "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  listaR1: Array<IR1> = [];
  mostrarUsuario:boolean = false;
  listaEspecialistas: Array<Especialista> = [];
  listaEspecialidades: Array<Especialidad> = [];
  listaPaciente: Array<Paciente> = [];
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
  usuariosColumnas: string[] = ['fecha', 'paciente', 'email', 'respuesta'];
  dataUsuarios: Array<any> = [];


  constructor(private db: FirestoreService,
              private spinner: SpinnerService,
              private swal: SwalService,
              private excel: ExcelService) { 
  }

  ngOnInit(): void {
    this.spinner.mostrar();

    this.cargarTurnos();

    this.cargarEspecialidades();

    this.cargarEspecialistas();
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

  mostrarR1(){

    this.opcion = 1;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    const misTurnos = this.turnos?.filter((t) => t.estadoTurno == 'Finalizado');

    misTurnos?.forEach((t) => {
      debugger;
      if(t.encuestaPaciente !== ""){
        if(t.encuestaPaciente != undefined){

          let aux: IR1 = {
            fecha: t.fechaInicio,
            paciente: t.paciente.nombre + ' ' + t.paciente.apellido,
            email: t.paciente.email,
            respuesta: t.encuestaPaciente.r1
          }
  
          this.listaR1.push(aux);
        }
      }
    });

    console.log('R1: ', this.listaR1);

    this.dataUsuarios = this.listaR1.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  }

  mostrarVisitas(){

    this.opcion = 6;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chartVisitas();
  }
  
  verUsuario(){
    this.mostrarUsuario = !this.mostrarUsuario;
  }

  private obtenerCantidadPorUsuario(data: any):Array<IUsuarioCantidad>{
    return data.reduce((accumulator:any, item:any) => {

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
      type: 'line',
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
}
