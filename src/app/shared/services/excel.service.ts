import { Injectable } from '@angular/core';
import * as excel from 'exceljs';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { Paciente } from '../models/paciente.class';
import { Turno } from '../models/turno.class';
import { Usuario } from '../models/usuario.class';
import { IUsuarioCantidad, ITurnoDiaCantidad, ITurnoEspecialistaCantidad, IVisitaCantidad } from 'src/app/core/graficos-y-estadisticas/graficos-y-estadisticas.component';
import { IEspecialidadCantidad } from 'src/app/core/graficos-y-estadisticas/components/informes/informes.component';
import { IDetallePaciente, IR2, IR3, IR4, IR5 } from 'src/app/core/graficos-y-estadisticas/components/informes-encuesta/informes-encuesta.component';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  guardarExcelListaUsuarios(listadoUsuarios: Usuario[]) {

    let nombre = "listado_de_usuarios";

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Listado de Usuarios");
    let encabezado = ["Nombre", "Apellido", "DNI", "Edad", "Mail", "Perfil", "Estado", "Fecha registro"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;
    

    for (let usuario of listadoUsuarios) {
      let fecha = new Date(usuario.fechaRegistro);
      let fila = [usuario.nombre, usuario.apellido, usuario.dni, usuario.edad, usuario.email, usuario.tipo, usuario.estado, this.formatearFechaRegistro(fecha)];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelDatosPaciente(paciente: Paciente, turnos: Turno[]) {

    let nombre = `consultas_de_${paciente.nombre}_${paciente.apellido}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Listado de Consultas");
    let encabezado = ["Paciente", "Especialista", "Especialidad", "DNI", "Edad", "Email", "Fecha"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let t of turnos) {
      let fila = [`${t.paciente.nombre} ${t.paciente.apellido}`, `${t.especialista.nombre} ${t.especialista.apellido}`, t.especialidad.especialidad, t.especialista.dni, t.especialista.edad, t.especialista.email, `${t.fecha} - ${t.horaInicio}`];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelLogIngresos(logs: IUsuarioCantidad[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Logs de ingresos");
    let encabezado = ["Email", "Cantidad"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let l of logs) {
      let fila = [l.email, l.cantidad];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelTurnosPorEspecialidad(turnosE: IEspecialidadCantidad[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Turnos por especialidad");
    let encabezado = ["Especialidad", "Cantidad"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let te of turnosE) {
      let fila = [te.especialidad, te.cantidad];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelTurnosPorDia(turnosD: ITurnoDiaCantidad[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Turnos por día");
    let encabezado = ["Día", "Cantidad"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let td of turnosD) {
      let fila = [td.dia, td.cantidad];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelTurnoSolicitados(turnosS: ITurnoEspecialistaCantidad[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Turnos solicitados por Especialista");
    let encabezado = ["Nombre", "Apellido", "Cantidad"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let ts of turnosS) {
      let fila = [ts.nombre, ts.apellido, ts.cantidad];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelTurnoFinalizados(turnosF: ITurnoEspecialistaCantidad[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Turnos finalizados por Especialista");
    let encabezado = ["Nombre", "Apellido", "Cantidad"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let tf of turnosF) {
      let fila = [tf.nombre, tf.apellido, tf.cantidad];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelVisitas(visitas: IVisitaCantidad[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Cantidad de visitas");
    let encabezado = ["Tipo usuario", "Cantidad"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let visita of visitas) {
      let fila = [visita.tipo, visita.cantidad];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelPacientesPorEspecialidad(especialidades: IEspecialidadCantidad[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Cantidad de pacientes por Especialista");
    let encabezado = ["Especialidad", "Cantidad de pacientes"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let e of especialidades) {
      let fila = [e.especialidad, e.cantidad];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelMedicosPorEspecialidad(especialidades: IEspecialidadCantidad[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Cantidad de médicos por Especialista");
    let encabezado = ["Especialidad", "Cantidad de médicos"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let e of especialidades) {
      let fila = [e.especialidad, e.cantidad];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelEncuestaR1(dataUsuarios: any[], nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Encuesta - R1. Exprese su opinión de la clínica");
    let encabezado = ["Fecha", "Paciente", "Email", "Respuesta"];
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    for (let u of dataUsuarios) {
      let fila = [this.formatearFechaRegistro(new Date(u.fecha)), u.paciente, u.email, u.respuesta];
      worksheet.addRow(fila);
    }

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelEncuestaR2(r2: IR2, nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("R2. Califica la clínica");
    let encabezado = ["Calificación", "Cantidad"];
    
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    let fila = ['1 estrella', r2.una];
      worksheet.addRow(fila);
    fila = ['2 estrellas', r2.dos];
      worksheet.addRow(fila);

    fila = ['3 estrellas', r2.tres];
      worksheet.addRow(fila);

    fila = ['4 estrellas', r2.cuatro];
      worksheet.addRow(fila);

    fila = ['5 estrellas', r2.cinco];
      worksheet.addRow(fila);

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelEncuestaR3(r3: IR3, nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("R3. Como valora la atención del profesional");
    let encabezado = ["Calificación", "Cantidad"];
    
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    let fila = ['1. Muy mal', r3.uno];
      worksheet.addRow(fila);
    fila = ['2. Mal', r3.dos];
      worksheet.addRow(fila);

    fila = ['3. Normal', r3.tres];
      worksheet.addRow(fila);

    fila = ['4. Bien', r3.cuatro];
      worksheet.addRow(fila);

    fila = ['5. Excelente', r3.cinco];
      worksheet.addRow(fila);

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelEncuestaR4(r4: IR4, nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("R4. Seleccione que considera que habría que reforzar en la clínica.");
    let encabezado = ["Aptitud", "Cantidad"];
    
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    let fila = ['Amabilidad', r4.amabilidad];
      worksheet.addRow(fila);

    fila = ['Tecnología', r4.tecnologia];
      worksheet.addRow(fila);

    fila = ['Profesionalismo', r4.profesionalismo];
      worksheet.addRow(fila);

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelEncuestaR5(r5: IR5, nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("R5. Como valora la higuiene de la clínica");
    let encabezado = ["Calificación Higuiene de 0 a 10", "Cantidad"];
    
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    let fila = ['0', r5.cero];
      worksheet.addRow(fila);

    fila = ['1', r5.una];
      worksheet.addRow(fila);

    fila = ['2', r5.dos];
      worksheet.addRow(fila);

    fila = ['3', r5.tres];
      worksheet.addRow(fila);

    fila = ['4', r5.cuatro];
      worksheet.addRow(fila);

    fila = ['5', r5.cinco];
      worksheet.addRow(fila);

    fila = ['6', r5.seis];
      worksheet.addRow(fila);

    fila = ['7', r5.siete];
      worksheet.addRow(fila);

    fila = ['8', r5.ocho];
      worksheet.addRow(fila);

    fila = ['9', r5.nueve];
      worksheet.addRow(fila);

    fila = ['10', r5.diez];
      worksheet.addRow(fila);

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  descargarExcelDetallePaciente(detallePaciente: IDetallePaciente, nombrePaciente: string, nombreFile: string) {

    let nombre = `${nombreFile}`;

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Detalle paciente " + nombrePaciente);
    let encabezado = ["Paciente ", nombrePaciente];
    worksheet.addRow(encabezado);
    encabezado = ["Estados de turno", "Cantidad"];
    
    let filaEncabezado = worksheet.addRow(encabezado);
    let nombreArchivo = `${nombre}${this.formatearFecha()}`;

    let fila = ['Solicitados', detallePaciente.solicitado];
      worksheet.addRow(fila);
    fila = ['Aceptados', detallePaciente.aceptado];
      worksheet.addRow(fila);

    fila = ['Realizados', detallePaciente.realizado];
      worksheet.addRow(fila);

    fila = ['Finalizados', detallePaciente.finalizado];
      worksheet.addRow(fila);

    fila = ['Cancelados', detallePaciente.cancelado];
      worksheet.addRow(fila);

    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, nombreArchivo + EXCEL_EXTENSION);
    })

  }

  private formatearFecha() {
    let date = new Date();

    let fecha = date.toLocaleDateString('es-AR');
    let hora = date.toLocaleTimeString('es-AR').split(':');
    return `_${fecha}_${hora[0]}:${hora[1]}:${hora[2]}`;
  }

  private formatearFechaRegistro(date: Date) {

    let fecha = date.toLocaleDateString('es-AR');
    let hora = date.toLocaleTimeString('es-AR').split(':');
    return `${fecha} - ${hora[0]}:${hora[1]}:${hora[2]}`;
  }
  

}
