import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Turno } from '../models/turno.class';
import { Usuario } from '../models/usuario.class';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  public doc = new jsPDF();
  constructor(private db: FirestoreService) { }

  descargarPDFHistoriaClinica(paciente: Usuario, turnos: Turno[]){

    const turnosSort = turnos.sort((a, b) => new Date(b.fechaInicio).getTime() - (new Date(a.fechaInicio)).getTime());
    let num = 60;
    let fecha = this.db.fechaCompleta(new Date().getTime());

    this.doc.addImage("./../../assets/logo.png", 'png', 175, 10, 25, 25);
    this.doc.setFont('helvetica');
    this.doc.setFontSize(12);
    this.doc.text("TP - CLINICA ONLINE", 10, 20);
    this.doc.text("Historia clinica de " + paciente.nombre + ' ' + paciente.apellido, 10, 30);

    for(let i = 0; i < turnosSort.length; i++ ){
      this.doc.text("|-------------------- Fecha turno:  " + this.db.fechaCompleta(turnosSort[i].fechaInicio) + "  --------------------|", 10, 50+(i*num));

      this.doc.text("Altura: " + turnosSort[i].historiaClinica?.altura , 10, 57+(i*num));
      this.doc.text("Peso: " + turnosSort[i].historiaClinica?.temperatura, 10, 64+(i*num));
      this.doc.text("Temperatura: " + turnosSort[i].historiaClinica?.temperatura, 10, 71+(i*num));
      this.doc.text("Presión: " + turnosSort[i].historiaClinica?.presion, 10, 78+(i*num));
      this.doc.text("Datos Extras: " , 10, 85+(i*num));
      this.doc.text(turnosSort[i].historiaClinica?.clave_1 + " : " + turnosSort[i].historiaClinica?.valor_1, 10, 92+(i*num));
      this.doc.text(turnosSort[i].historiaClinica?.clave_2 + " : " + turnosSort[i].historiaClinica?.valor_2, 60, 92+(i*num));
      this.doc.text(turnosSort[i].historiaClinica?.clave_3 + " : " + turnosSort[i].historiaClinica?.valor_3, 90, 92+(i*num));
      this.doc.text(turnosSort[i].historiaClinica?.clave_4 + " : " + turnosSort[i].historiaClinica?.valor_4, 10, 99+(i*num));
      this.doc.text(turnosSort[i].historiaClinica?.clave_5 + " : " + turnosSort[i].historiaClinica?.valor_5, 60, 99+(i*num));
      this.doc.text(turnosSort[i].historiaClinica?.clave_6 + " : " + turnosSort[i].historiaClinica?.valor_6, 90, 99+(i*num));
    }


    this.doc.text("Fecha de emisión:  " + fecha, 10, 280);
    this.doc.save("historia" + paciente.nombre + paciente.apellido + ".pdf");
  }
}
