import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Paciente } from '../models/paciente.class';
import { Turno } from '../models/turno.class';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  public doc = new jsPDF();
  constructor(private db: FirestoreService) { }

  public CrearPDFHistoriaClinica(paciente: Paciente, turnos: Turno[])
  {
    let num = 45;
    let fecha = this.db.fechaCompleta(new Date().getTime());

    this.doc.addImage("./../../assets/logo.png", 'png', 175, 10, 25, 25);
    this.doc.setFont('helvetica');
    this.doc.setFontSize(12);
    this.doc.text("TP - CLINICA ONLINE", 10, 20);
    this.doc.text("Historia clinica de " + paciente.nombre + ' ' + paciente.apellido, 10, 30);

    for(let i = 0; i < turnos.length; i++ ){
      this.doc.text("|-------------------- Fecha turno:  " + this.db.fechaCompleta(turnos[i].fechaInicio) + "  --------------------|", 10, 50+(i*num));

      this.doc.text("Altura: " + turnos[i].historiaClinica?.altura , 10, 57+(i*num));
      this.doc.text("temperatura: " + turnos[i].historiaClinica?.temperatura, 10, 64+(i*num));
      this.doc.text("Presion: " + turnos[i].historiaClinica?.presion, 10, 71+(i*num));
      this.doc.text("Datos Extras: " , 10, 78+(i*num));
      this.doc.text(turnos[i].historiaClinica?.d1.clave + " : " + turnos[i].historiaClinica?.d1.valor, 40, 78+(i*num));
      this.doc.text(turnos[i].historiaClinica?.d2.clave + " : " + turnos[i].historiaClinica?.d2.valor, 90, 78+(i*num));
      this.doc.text(turnos[i].historiaClinica?.d3.clave + " : " + turnos[i].historiaClinica?.d3.valor, 140, 78+(i*num));
      this.doc.text(turnos[i].historiaClinica?.d4.clave + " : " + turnos[i].historiaClinica?.d4.valor, 190, 78+(i*num));
      this.doc.text(turnos[i].historiaClinica?.d5.clave + " : " + turnos[i].historiaClinica?.d5.valor, 240, 78+(i*num));
      this.doc.text(turnos[i].historiaClinica?.d6.clave + " : " + turnos[i].historiaClinica?.d6.valor, 290, 78+(i*num));
    }


    this.doc.text("Fecha de emisión:  " + fecha, 10, 280);
    this.doc.save("historia" + paciente.nombre + paciente.apellido + ".pdf");
  }
}
