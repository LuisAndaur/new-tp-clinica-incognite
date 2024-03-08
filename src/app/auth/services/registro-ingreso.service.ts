import { Injectable } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RegistroIngresoService {

  constructor( private db: Firestore ) { }

  async setRegistroIngreso(email: string) {

    const registroRef = doc(collection(this.db, 'registro-ingreso'));
    return await setDoc(registroRef, {
      email: email,
      fecha: new Date().getTime()
    });
  }
}
