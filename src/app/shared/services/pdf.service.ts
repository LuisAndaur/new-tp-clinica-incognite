import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Turno } from '../models/turno.class';
import { Usuario } from '../models/usuario.class';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private db: FirestoreService) { }

  descargarPDFHistoriaClinica(paciente: Usuario, turnos: Turno[]){

    let doc = new jsPDF();

    let turnosSort = turnos.sort((a, b) => new Date(b.fechaInicio).getTime() - (new Date(a.fechaInicio)).getTime());
    let num = 60;
    let fecha = this.db.fechaCompleta(new Date().getTime());

    doc.addImage("./../../assets/logo.png", 'png', 175, 10, 25, 25);
    doc.setFont('helvetica');
    doc.setFontSize(12);
    doc.text("TP - CLINICA ONLINE", 10, 20);
    doc.text("Historia clinica de " + paciente.nombre + ' ' + paciente.apellido, 10, 30);

    for(let i = 0; i < turnosSort.length; i++ ){
      doc.text("|-------------------- Fecha turno:  " + this.db.fechaCompleta(turnosSort[i].fechaInicio) + "  --------------------|", 10, 50+(i*num));

      doc.text("Especialista: " + turnosSort[i].especialista.nombre + ' ' + turnosSort[i].especialista.apellido, 10, 57+(i*num));
      doc.text("Especialidad: " + turnosSort[i].especialidad.especialidad , 100, 57+(i*num));
      doc.text("Altura: " + turnosSort[i].historiaClinica?.altura , 10, 64+(i*num));
      doc.text("Peso: " + turnosSort[i].historiaClinica?.temperatura, 80, 64+(i*num));
      doc.text("Temperatura: " + turnosSort[i].historiaClinica?.temperatura, 10, 71+(i*num));
      doc.text("Presión: " + turnosSort[i].historiaClinica?.presion, 80, 71+(i*num));
      doc.text("Datos Extras: " , 10, 78+(i*num));
      doc.text(turnosSort[i].historiaClinica?.clave_1 + " : " + turnosSort[i].historiaClinica?.valor_1, 10, 85+(i*num));
      doc.text(turnosSort[i].historiaClinica?.clave_2 + " : " + turnosSort[i].historiaClinica?.valor_2, 70, 85+(i*num));
      doc.text(turnosSort[i].historiaClinica?.clave_3 + " : " + turnosSort[i].historiaClinica?.valor_3, 130, 85+(i*num));
      doc.text(turnosSort[i].historiaClinica?.clave_4 + " : " + turnosSort[i].historiaClinica?.valor_4, 10, 92+(i*num));
      doc.text(turnosSort[i].historiaClinica?.clave_5 + " : " + turnosSort[i].historiaClinica?.valor_5, 70, 92+(i*num));
      doc.text(turnosSort[i].historiaClinica?.clave_6 + " : " + turnosSort[i].historiaClinica?.valor_6, 130, 92+(i*num));
    }


    doc.text("Fecha de emisión:  " + fecha, 10, 280);
    doc.save("historia" + paciente.nombre + paciente.apellido + ".pdf");
  }
}
