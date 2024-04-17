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

export class IDetallePaciente{
  solicitado: number = 0;
  aceptado: number = 0;
  realizado: number = 0;
  finalizado: number = 0;
  cancelado: number = 0;
}

export class IR1{
  fecha!: Date;
  paciente!: string;
  email!: string;
  respuesta!: string;
}

export class IR2{
  una: number = 0;
  dos: number = 0;
  tres: number = 0;
  cuatro: number = 0;
  cinco: number = 0;
}

export class IR3{
  uno: number = 0;
  dos: number = 0;
  tres: number = 0;
  cuatro: number = 0;
  cinco: number = 0;
}

export class IR4{
  amabilidad: number = 0;
  tecnologia: number = 0;
  profesionalismo: number = 0;
}

export class IR5{
  cero: number = 0;
  una: number = 0;
  dos: number = 0;
  tres: number = 0;
  cuatro: number = 0;
  cinco: number = 0;
  seis: number = 0;
  siete: number = 0;
  ocho: number = 0;
  nueve: number = 0;
  diez: number = 0;
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

export interface IEspecialidadCantidad{
  especialidad: string;
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
  respuesta2: IR2 = new IR2();
  respuesta3: IR3 = new IR3();
  respuesta4: IR4 = new IR4();
  respuesta5: IR5 = new IR5();
  mostrarUsuario:boolean = false;
  pacienteElegido:string = '';
  preguntaEncuesta:string = '';
  nombrePacienteElegido:string = '';
  listaEspecialistas: Array<Especialista> = [];
  listaPacientes: Array<Paciente> = [];
  listaEspecialidades: Array<Especialidad> = [];
  listaPaciente: Array<Paciente> = [];
  listaTurnosSolicitados: Array<Turno> = [];
  listaTurnosFinalizados: Array<Turno> = [];
  detallePacienteGral: IDetallePaciente = new IDetallePaciente();
  turnos: Array<any> | null = [];
  private contadorPacientesPorEspecialidad: Array<IEspecialidadCantidad> = [];
  private contadorMedicosPorEspecialidad: Array<IEspecialidadCantidad> = [];
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

    this.cargarLogIngresos();

    this.cargarTurnos();

    this.cargarPacientes();

    this.cargarEspecialidades();

    this.cargarEspecialistas();
  }

  private async cargarLogIngresos(){

    await this.db.obtenerRegistrosIngresos()
    .then((logs)=>{

      this.db.obtenerUsuarios().subscribe((user) => {

        user.forEach((u) => {
          logs.forEach((l) => {
            if(l.email == u['email']){

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
      debugger;
      // this.dataUsuarios = this.listaLogsDeIngresos;
      
    }).finally(()=> this.spinner.ocultar());
  }

  private async cargarEspecialistas(){

    await this.db.obtenerLosEspecialistas()
    .then((e)=>{
      this.listaEspecialistas = e;
      console.log('listaEspecialistasEncuesta: ',this.listaEspecialistas);
    }).finally(()=> this.spinner.ocultar());
  }

  private async cargarPacientes(){

    await this.db.obtenerPacientes()
    .then((p)=>{
      this.listaPacientes = p;
      console.log('listaPacientes: ',this.listaPacientes);
    }).finally(()=> this.spinner.ocultar());
  }

  private async cargarEspecialidades(){

    await this.db.obtenerLasEspecialidades()
    .then((e)=>{
      this.listaEspecialidades = e;
      console.log('listaEspecialidades: ',this.listaEspecialidades);
    }).finally(()=> this.spinner.ocultar());
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

    this.preguntaEncuesta = 'R1. Exprese su opinión de la clínica';

    this.opcion = 1;
    this.verGrafico = false;
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

  mostrarR2(){

    this.preguntaEncuesta = 'R2. Califica la clínica';

    this.opcion = 2;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    let r2: IR2 = new IR2();
    this.respuesta2 = r2;
    const misTurnos = this.turnos?.filter((t) => t.estadoTurno == 'Finalizado');

    misTurnos?.forEach((t) => {
      debugger;
      if(t.encuestaPaciente !== ""){
        if(t.encuestaPaciente != undefined){

          if(t.encuestaPaciente.r2 == 1)
            r2.una++;

          if(t.encuestaPaciente.r2 == 2)
            r2.dos++;

          if(t.encuestaPaciente.r2 == 3)
            r2.tres++;

          if(t.encuestaPaciente.r2 == 4)
            r2.cuatro++;

          if(t.encuestaPaciente.r2 == 5)
            r2.cinco++;
        }
      }
    });

    console.log('R2: ', r2);

    this.chartR2();
  }

  mostrarR3(){

    this.preguntaEncuesta = 'R3. ¿Cómo valorás la atención del profesional?';

    this.opcion = 3;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    let r3: IR3 = new IR3();
    this.respuesta3 = r3;
    const misTurnos = this.turnos?.filter((t) => t.estadoTurno == 'Finalizado');

    misTurnos?.forEach((t) => {
      debugger;
      if(t.encuestaPaciente !== ""){
        if(t.encuestaPaciente != undefined){

          if(t.encuestaPaciente.r3 == 1)
            r3.uno++;

          if(t.encuestaPaciente.r3 == 2)
            r3.dos++;

          if(t.encuestaPaciente.r3 == 3)
            r3.tres++;

          if(t.encuestaPaciente.r3 == 4)
            r3.cuatro++;

          if(t.encuestaPaciente.r3 == 5)
            r3.cinco++;
        }
      }
    });

    console.log('R3: ', r3);

    this.chartR3();
  }

  mostrarR4(){

    this.preguntaEncuesta = 'R4. Seleccione que considera que habría que reforzar en la clínica.';

    this.opcion = 4;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    let r4: IR4 = new IR4();
    this.respuesta4 = r4;
    const misTurnos = this.turnos?.filter((t) => t.estadoTurno == 'Finalizado');

    misTurnos?.forEach((t) => {
      debugger;
      if(t.encuestaPaciente !== ""){
        if(t.encuestaPaciente != undefined){

          if(t.encuestaPaciente.r4_1)
            r4.amabilidad++;

          if(t.encuestaPaciente.r4_2)
            r4.tecnologia++;

          if(t.encuestaPaciente.r4_3)
            r4.profesionalismo++;
        }
      }
    });

    console.log('R4: ', r4);

    this.chartR4();
  }

  mostrarR5(){

    this.preguntaEncuesta = 'R5. ¿Cómo valorás la higuiene de la clínica?';

    this.opcion = 5;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    let r5: IR5 = new IR5();
    this.respuesta5 = r5;
    const misTurnos = this.turnos?.filter((t) => t.estadoTurno == 'Finalizado');

    misTurnos?.forEach((t) => {
      debugger;
      if(t.encuestaPaciente !== ""){
        if(t.encuestaPaciente != undefined){

          if(t.encuestaPaciente.r5 == '0')
            r5.cero++;

          if(t.encuestaPaciente.r5 == '1')
            r5.una++;

          if(t.encuestaPaciente.r5 == '2')
            r5.dos++;

          if(t.encuestaPaciente.r5 == '3')
            r5.tres++;

          if(t.encuestaPaciente.r5 == '4')
            r5.cuatro++;

          if(t.encuestaPaciente.r5 == '5')
            r5.cinco++;

          if(t.encuestaPaciente.r5 == '6')
            r5.seis++;

          if(t.encuestaPaciente.r5 == '7')
            r5.siete++;

          if(t.encuestaPaciente.r5 == '8')
            r5.ocho++;

          if(t.encuestaPaciente.r5 == '9')
            r5.nueve++;

          if(t.encuestaPaciente.r5 == '10')
            r5.diez++;
        }
      }
    });

    console.log('R5: ', r5);

    this.chartR5();
  }

  private detallePaciente(id: string){

    this.preguntaEncuesta = '';

    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    let detallePaciente: IDetallePaciente = new IDetallePaciente();
    this.detallePacienteGral = detallePaciente;
    const misTurnos = this.turnos?.filter((t) => t.paciente.id == id);

    misTurnos?.forEach((t) => {

      this.nombrePacienteElegido = t.paciente.nombre + ' ' + t.paciente.apellido;
      debugger;
      if(t.estadoTurno == "Solicitado")
        detallePaciente.solicitado++;

      if(t.estadoTurno == "Cancelado")
        detallePaciente.cancelado++;

      if(t.estadoTurno == "Aceptado")
        detallePaciente.aceptado++;

      if(t.estadoTurno == "Realizado")
        detallePaciente.realizado++;

      if(t.estadoTurno == "Finalizado")
        detallePaciente.finalizado++;
    });

    this.detallePacienteGral = detallePaciente;

    this.chartDetallePaciente();

  }

  mostrarVisitas(){

    this.opcion = 7;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chartVisitas();
  }
  
  verUsuario(){
    this.mostrarUsuario = !this.mostrarUsuario;
  }

  setearOpcion(index:number){
    this.preguntaEncuesta = '';
    this.verGrafico = false;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.opcion = index;
  }

  buscar(){

    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    if(this.pacienteElegido == ''){
      this.swal.warning('Debe seleccionar un paciente!')
    }
    else{
      this.detallePaciente(this.pacienteElegido);
    }

  }

  seleccion(user: string){
    console.log('paciente elegido: ', user);
    this.pacienteElegido = user;
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

  private chartR3(){

    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'polarArea',
      data: {
        labels: ['1. Muy mal', '2. Mal', '3. Normal', '4. Bien', '5. Excelente'],
        datasets: [{
          label: 'Encuesta - ' + this.preguntaEncuesta,
          data: [ this.respuesta3.uno, 
                  this.respuesta3.dos, 
                  this.respuesta3.tres, 
                  this.respuesta3.cuatro, 
                  this.respuesta3.cinco,         
          ],
          borderWidth: 1,
        }]
      },
    });
  }

  private chartR2(){

    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'pie',
      data: {
        labels: ['1 Estrella', '2 Estrellas', '3 Estrellas', '4 Estrellas', '5 Estrellas'],
        datasets: [{
          label: 'Encuesta - R2. Califica la clínica',
          data: [ this.respuesta2.una, 
                  this.respuesta2.dos, 
                  this.respuesta2.tres, 
                  this.respuesta2.cuatro, 
                  this.respuesta2.cinco,         
          ],
          borderWidth: 1,
        }]
      },
    });
  }

  private chartR4(){

    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'doughnut',
      data: {
        labels: ['Amabilidad', 'Tecnología', 'Profesionalismo'],
        datasets: [{
          label: 'Encuesta - ' + this.preguntaEncuesta,
          data: [ this.respuesta4.amabilidad, 
                  this.respuesta4.tecnologia, 
                  this.respuesta4.profesionalismo       
          ],
          borderWidth: 1,
        }]
      },
    });
  }

  private chartR5(){

    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: ['0','1','2','3','4','5','6','7','8','9','10'],
        datasets: [{
          label: 'Encuesta - ' + this.preguntaEncuesta,
          data: [ this.respuesta5.una, 
                  this.respuesta5.dos, 
                  this.respuesta5.tres, 
                  this.respuesta5.cuatro, 
                  this.respuesta5.cinco,
                  this.respuesta5.seis,
                  this.respuesta5.siete,
                  this.respuesta5.ocho,
                  this.respuesta5.nueve,
                  this.respuesta5.diez,         
          ],
          borderWidth: 1,
        }]
      },
    });
  }

  private chartDetallePaciente(){

    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: ['Solicitados', 'Aceptados', 'Realizados', 'Finalizados', 'Cancelados'],
        datasets: [{
          label: 'Detalle de paciente: ' + this.nombrePacienteElegido,
          data: [ this.detallePacienteGral.solicitado, 
                  this.detallePacienteGral.aceptado, 
                  this.detallePacienteGral.realizado, 
                  this.detallePacienteGral.finalizado, 
                  this.detallePacienteGral.cancelado,         
          ],
          borderWidth: 1,
        }]
      },
    });
  }

  pacientesPorEspecialidad(){

    this.opcion = 8;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    let auxTurnos = this.turnos?.filter((t) => t.estadoTurno == 'Finalizado');
    console.log('turnos finalizados: ', auxTurnos);

    this.contadorPacientesPorEspecialidad = this.obtenerCantidadPacientesPorEspecialidad(auxTurnos);
    this.chartPacientesPorEspecialidad();
  }

  medicosPorEspecialidad(){

    this.opcion = 9;
    this.verGrafico = true;
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.contadorMedicosPorEspecialidad = this.obtenerCantidadMedicosPorEspecialidad(this.listaEspecialidades).sort((a, b) => b.cantidad - a.cantidad);
    console.log('medicos por especialidad: ', this.contadorMedicosPorEspecialidad);
    this.chartMedicosPorEspecialidad();
  }

  private obtenerCantidadPacientesPorEspecialidad(data: any):Array<IEspecialidadCantidad>{
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

  private obtenerCantidadMedicosPorEspecialidad(data: Array<Especialidad>):Array<IEspecialidadCantidad>{
    let array: Array<IEspecialidadCantidad> = [];
    let auxEspecialidad = '';
    let cantidad = 0;

    data.forEach((especialidad) => {

      this.listaEspecialistas.forEach((especialista) => {
        especialista.especialidades.forEach((e) => {
          if(especialidad.especialidad == e.especialidad){
            auxEspecialidad = e.especialidad;
            cantidad++;
          }
        });
      });

      if(auxEspecialidad!=''){

        let aux: IEspecialidadCantidad = {especialidad: auxEspecialidad, cantidad: cantidad};
        array.push(aux);
      }

      auxEspecialidad = '';
      cantidad = 0;
    });

    return array;
  }

  private chartPacientesPorEspecialidad(){
    const especialidades = this.contadorPacientesPorEspecialidad.map(e=> e.especialidad);
    const cantidad = this.contadorPacientesPorEspecialidad.map(e=> e.cantidad);
  
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: especialidades,
        datasets: [{
          label: 'Pacientes por especialidad',
          data: cantidad,
          borderWidth: 1,
        }]
      },
    });
  }

  private chartMedicosPorEspecialidad(){
    const especialidades = this.contadorMedicosPorEspecialidad.map(e=> e.especialidad);
    const cantidad = this.contadorMedicosPorEspecialidad.map(e=> e.cantidad);
  
    if(this.chart instanceof Chart){
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'pie',
      data: {
        labels: especialidades,
        datasets: [{
          label: 'Médicos por especialidad',
          data: cantidad,
          borderWidth: 1,
        }]
      },
    });
  }

  descargarExcel(){

    switch(this.opcion){
      case 1:
        this.excel.descargarExcelEncuestaR1(this.dataUsuarios, this.setearnombre());
        break;

      case 2:
          this.excel.descargarExcelEncuestaR2(this.respuesta2, this.setearnombre());
          break;

      case 3:
        this.excel.descargarExcelEncuestaR3(this.respuesta3, this.setearnombre());
        break;

      case 4:
        this.excel.descargarExcelEncuestaR4(this.respuesta4, this.setearnombre())
        break;

      case 5:
        this.excel.descargarExcelEncuestaR5(this.respuesta5, this.setearnombre())
        break;

      case 6:
        this.excel.descargarExcelDetallePaciente(this.detallePacienteGral, this.nombrePacienteElegido, this.setearnombre())
        break;

      case 7:
        let visitas: Array<IVisitaCantidad> = [
          { tipo: 'Administrador', cantidad: this.contadorAdministrador},
          { tipo: 'Especialistas', cantidad: this.contadorEspecialista},
          { tipo: 'Paciente', cantidad: this.contadorPaciente}
        ];
        this.excel.descargarExcelVisitas(visitas, this.setearnombre());
        break;

      case 8:
        this.excel.descargarExcelPacientesPorEspecialidad(this.contadorPacientesPorEspecialidad, this.setearnombre())
        break;

      case 9:
        this.excel.descargarExcelMedicosPorEspecialidad(this.contadorMedicosPorEspecialidad, this.setearnombre())
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
        titulo = 'Encuesta: R1. Exprese su opinión de la clínica';
        break;

      case 2:
          titulo = 'Encuesta: R2. Califica la clínica';
          break;

      case 3:
        titulo = 'Encuesta: R3. ¿Cómo valorás la atención del profesional?';
        break;

      case 4:
        titulo = 'Encuesta: R4. Que considera que habría que reforzar en la clínica';
        break;

      case 5:
        titulo = 'Encuesta: R5. ¿Cómo valorás la higuiene de la clínica?';
        break;

      case 6:
        titulo = 'Detalle paciente: ' + this.nombrePacienteElegido;
        break;

      case 7:
        titulo = 'Cantidad de visitas que tuvo la clínica';
        break;

      case 8:
        titulo = 'Cantidad de pacientes por especialidad';
        break;

      case 9:
        titulo = 'Cantidad de médicos por especialidad';
        break;
    }

    return titulo;
  }

  private setearnombre(){

    let nombre = '';

    switch(this.opcion){
      case 1:
        nombre = 'encuesta_r1';
        break;

      case 2:
          nombre = 'encuesta_r2';
          break;

      case 3:
        nombre = 'encuesta_r3';
        break;

      case 4:
        nombre = 'encuesta_r4';
        break;

      case 5:
        nombre = 'encuesta_r5';
        break;

      case 6:
        nombre = 'detalle_paciente_' + this.nombrePacienteElegido;
        break;

      case 7:
        nombre = 'cantidad_de_visitas';
        break;

      case 8:
        nombre = 'cantidad_pacientes_por_especialidad';
        break;
  
      case 9:
        nombre = 'cantidad_medicos_por_especialidad';
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
