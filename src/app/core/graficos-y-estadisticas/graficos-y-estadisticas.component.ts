import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataset, ChartType } from 'chart.js/auto';
import { Especialidad } from 'src/app/shared/models/especialidad.class';
import { LogIngresos } from 'src/app/shared/models/log-ingresos.class';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { PdfService } from 'src/app/shared/services/pdf.service';
import { SpinnerService } from 'src/app/shared/services/spinner.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export type Dias = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

export interface IUsuarioCantidad {
  email: string;
  cantidad: number;
}

export interface ILogIngreso{
  fecha: number;
  email: string;
}

export interface ITurnoEspecialidadCantidad{
  especialidad: string;
  cantidad: number;
}

export interface ITurnoDiaCantidad{
  dia: Dias;
  cantidad: number;
}

export interface ITurnoEspecialistaCantidad{
  idEspecialista: string;
  nombre: string;
  apellido: string;
  cantidad: number;
}

export interface IExcelGrafico {

  label: string;
  valor: number;
}

@Component({
  selector: 'app-graficos-y-estadisticas',
  templateUrl: './graficos-y-estadisticas.component.html',
  styleUrls: ['./graficos-y-estadisticas.component.scss']
})
export class GraficosYEstadisticasComponent implements OnInit {

  labelChart = new Array<string>();
  lineChartData:ChartDataset[] = [];
  lineChartType:ChartType = 'line';
  chart:any;
  logsDeIngresos: Array<any> = [];
  usuario:any;
  logsDeUnIngreso = new Array<ILogIngreso>;
  mostrarUsuario:boolean = false;
  listaEspecialistas: Array<any> | null = [];
  listaEspecialidades: Array<Especialidad> = [];
  turnos: Array<any> | null = [];
  private contadorRegistros: Array<IUsuarioCantidad> = [];
  private contadorTurnoPorEspecialidad: Array<ITurnoEspecialidadCantidad> = [];
  private contadorTurnoPorDia: Array<ITurnoDiaCantidad> = [];
  fechaInicial = new Date();
  fechaMaxima = new Date();
  opcion:number = -1;


  constructor(private db: FirestoreService,
              private spinner: SpinnerService,
              private excel: ExcelService, 
              private pdf: PdfService) { 
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

  private async cargarTurnos(){

    await this.db.obtenerLosTurnos()
    .then((t)=>{
      this.turnos = t;
      console.log('turnos: ',this.turnos);
    }).finally(()=> this.spinner.ocultar());;
  }

  mostrarLogIngresos(){
    this.contadorRegistros = this.indicarCantidadPorUsuario(this.logsDeIngresos);
    debugger;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    let map = new Map<string, number>();

    for(let i = 0; i < this.contadorRegistros.length; i++){

      map.set(this.contadorRegistros[i].email, this.contadorRegistros[i].cantidad);
    } 

    this.createChart(map, ['Logs de ingresos'], 'bar');


  }

  turnosPorEspecialidad(){

    this.opcion = -1;
    this.logsDeUnIngreso.length = 0;
    let map = new Map<string, number>();

    for(let i = 0; i < this.listaEspecialidades.length; i++){

      if(!map.has(this.listaEspecialidades[i].especialidad)){

        map.set(this.listaEspecialidades[i].especialidad, 0);

        for(let j = 0; j < this.turnos!.length; j++){

          if(this.turnos![j].especialidad == this.listaEspecialidades[i].especialidad){

            let valor = <number> map.get(this.listaEspecialidades[i].especialidad);
            valor++;
            map.set(this.listaEspecialidades[i].especialidad, valor);
          }
        }
      }
    } 

    this.createChart(map, ['Especialidades'], 'bar');
  }

  setearOpcion(index:number){
    this.logsDeUnIngreso.length = 0;

    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.opcion = index;
  }

  confirmar(){
    if(this.opcion == 0){
      this.cantidadTurnosSolicitados();
    }
    else{  
      if(this.opcion == 1){
        this.cantidadTurnosFinalizados();
      }
    }
  }

  cantidadTurnosPorDia(){
    this.opcion = -1;
    this.logsDeUnIngreso.length = 0;
    let map = new Map<string, number>();

    for(let i = 0; i < this.turnos!.length; i++){

      if(!map.has(this.turnos![i].fecha)){

        map.set(this.turnos![i].fecha, 0);
        for(let j = 0; j < this.turnos!.length; j++){

          if(this.turnos![j].fecha == this.turnos![i].fecha){

            let valor = <number> map.get(this.turnos![i].fecha);
            valor++;
            map.set(this.turnos![i].fecha, valor);
          }
        }
      }
    } 
    this.createChart(map, ['Dias'], 'bar');
  }

  cantidadTurnosSolicitados(){
    this.logsDeUnIngreso.length = 0;
    let map = new Map<string, number>();

    for(let i = 0; i < this.listaEspecialistas!.length; i++){

      let especialistaNombre = this.listaEspecialistas![i].nombre + this.listaEspecialistas![i].apellido;
      
      if(!map.has(especialistaNombre)){
        map.set(especialistaNombre, 0);
      }

      for(let j = 0; j < this.turnos!.length; j++){

        if(this.validarFecha(this.turnos![j].fecha) && this.turnos![j].estadoTurno == 'esperando decision'){

          let segundoRecorrido = this.turnos![j].especialista.nombre + this.turnos![j].especialista.apellido;
          
          if(especialistaNombre == segundoRecorrido){
            
            let valor = <number> map.get(especialistaNombre);
            valor++;
            map.set(especialistaNombre, valor);
          }
        }
      }
    }

    this.createChart(map, ['Fechas'], 'bar');
  }

  verUsuario(){
    this.mostrarUsuario = !this.mostrarUsuario;
  }

  private indicarCantidadPorUsuario(data: any):Array<IUsuarioCantidad>{
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

  private validarFecha(fecha:string):boolean{
    let fechaValor = fecha.split('/');
    let fechaInicial = this.fechaInicial.toString().split('-');
    let fechaMaxima = this.fechaMaxima.toString().split('-');
    let dateFechaInicial = new Date(Number.parseInt(fechaInicial[0]), Number.parseInt(fechaInicial[1]) - 1, Number.parseInt(fechaInicial[2]));
    let dateFechaMaxima = new Date(Number.parseInt(fechaMaxima[0]), Number.parseInt(fechaMaxima[1]) - 1, Number.parseInt(fechaMaxima[2]));
    let dateFechaValor = new Date(Number.parseInt(fechaValor[2]), Number.parseInt(fechaValor[1]) - 1, Number.parseInt(fechaValor[0]));

    console.log(dateFechaInicial);
    console.log(dateFechaMaxima);
    console.log(dateFechaValor);

    if(dateFechaInicial <= dateFechaValor && dateFechaValor <= dateFechaMaxima){
      return true;
    }

    return false;
  }

  actualizarFecha(evento:any, valor:string){

    if(valor == 'inicial'){
      this.fechaInicial = evento;
    }
    else{
      this.fechaMaxima = evento;
    }
  }

  
  cantidadTurnosFinalizados(){
    this.logsDeUnIngreso.length = 0;
    let map = new Map<string, number>();

    for(let i = 0; i < this.listaEspecialistas!.length; i++){

      let especialistaNombre = this.listaEspecialistas![i].nombre + this.listaEspecialistas![i].apellido;
      
      if(!map.has(especialistaNombre)){
        map.set(especialistaNombre, 0);
      }

      for(let j = 0; j < this.turnos!.length; j++){
        
        if(this.validarFecha(this.turnos![j].fecha) && this.turnos![j].estadoTurno == 'realizado'){
          let segundoRecorrido = this.turnos![j].especialista.nombre + this.turnos![j].especialista.apellido;
          
          if(especialistaNombre == segundoRecorrido){
            let valor = <number> map.get(especialistaNombre);
            valor++;
            map.set(especialistaNombre, valor);
          }
        }
      }
    }
    this.createChart(map, ['Fechas'], 'bar');
  }

  private createChart(datos:Map<string, number>, label:Array<string>, type:ChartType){
  
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    let clave =  Array.from(datos.keys());
    this.labelChart = label;
    this.lineChartData = [];
    this.lineChartType = type;

    for(let i = 0; i < datos.size; i++){
        this.lineChartData.push({ data: [<number> datos.get(clave[i])], label: clave[i] });
    }

    this.chart = new Chart('chart', {
      type: this.lineChartType,
      data: {
        labels: this.labelChart,
        datasets: this.lineChartData
      },
      options: {aspectRatio:2.5}
    });
  }

  descargarExcel(){
    let arrayExcel = new Array<IExcelGrafico>();
      
    this.lineChartData.forEach(dato=>{
      let obj:IExcelGrafico = {label:<string>dato['label'], valor:<number>dato['data'][0]};
      arrayExcel.push(obj);
    })

    this.excel.descargarExcelGrafico(arrayExcel, 'logs_de_ingresos');
  }

  descargarPDF(): void {
    debugger;
    const DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      const fileWidth = 210;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const fecha = new Date().getTime();
      const titulo = "Gráficos y estadística";
      pdf.text(titulo, 5, 10);
      pdf.setFont('helvetica');
      pdf.setFontSize(12);
      pdf.text(`Fecha: ${this.db.fechaCompleta(fecha)}`, 5, 18.5);
      pdf.addImage(FILEURI, 'PNG', 0, 25, fileWidth, fileHeight);
      pdf.addImage("./../../../assets/logo.png", 'PNG', 185, 3, 16, 16);
      const nombreDeArchivo = `graficos_${fecha}`;
      pdf.save(nombreDeArchivo);
    });
  }
}
