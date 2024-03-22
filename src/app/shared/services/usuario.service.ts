import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario.class';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private cUsuarios = 'usuarios';

  constructor( private db: Firestore ) {}

  // agregarUsuario(usuario: Usuario) {

  //   const usuarioRef = doc(collection(this.db, this.cUsuarios), usuario.id);
  //   return setDoc(usuarioRef, {...usuario});

  // }

  actualizarUsuario(usuario: Usuario, id: string): Promise<void> {

    const usuarioRef = doc(this.db, id);
    return updateDoc(usuarioRef, {
      ...usuario,
    });

  }

  async obtenerUsuario(email:string)
  {
    let usuario = null;
    const querySnapshot = await getDocs(collection(this.db, this.cUsuarios));
    querySnapshot.forEach((doc) =>
    {
      let profile = doc.data();
      if(profile['email'] == email)
      {
        usuario = profile;
      }
    })
    return usuario;
  }
}
