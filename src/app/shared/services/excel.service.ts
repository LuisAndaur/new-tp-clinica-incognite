import { Injectable } from '@angular/core';
import * as excel from 'exceljs';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { Paciente } from '../models/paciente.class';
import { Turno } from '../models/turno.class';
import { Usuario } from '../models/usuario.class';
import { IUsuarioCantidad, ITurnoDiaCantidad, ITurnoEspecialistaCantidad, IVisitaCantidad } from 'src/app/core/graficos-y-estadisticas/graficos-y-estadisticas.component';
import { IEspecialidadCantidad } from 'src/app/core/graficos-y-estadisticas/components/informes/informes.component';

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
