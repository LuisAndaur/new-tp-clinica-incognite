import { Injectable } from '@angular/core';
import * as excel from 'exceljs';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { Paciente } from '../models/paciente.class';
import { Turno } from '../models/turno.class';
import { Usuario } from '../models/usuario.class';

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

  descargarExcelGrafico(json: any[], nombreInforme: string): void {

    let nombre = `Informe_grafico_de_${nombreInforme}`;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.guardarArchivoExcel(excelBuffer, `${nombre}${this.formatearFecha()}`);
  }

  private guardarArchivoExcel(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
   fs.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
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
