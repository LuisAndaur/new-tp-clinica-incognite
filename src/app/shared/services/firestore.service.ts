import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, orderBy, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Especialista } from '../models/especialista.class';
import { Paciente } from '../models/paciente.class';
import { Usuario } from '../models/usuario.class';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private cUsuarios:string = 'usuarios';
  private cEspecialidades:string = 'especialidades';

  constructor(private db: Firestore,
              private storage: StorageService) 
  { }

  generarRandom(num: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let result = "";
      for (let i = 0; i < num; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
  
    return result;
  }

  async obtenerUsuario(email:string){
    let usuario = null;
    const querySnapshot = await getDocs(collection(this.db, this.cUsuarios));
    querySnapshot.forEach((doc) =>{

      let user = doc.data();

      if(user['email'] == email){
        usuario = user;
      }

    });

    return usuario;
  }

  obtenerUsuarios() {
    const usuariosRef = collection(this.db, this.cUsuarios);
    const q = query(usuariosRef, orderBy('tipo', 'asc'));
    return collectionData(q,{ idField: 'id' }) ;
  }
  
  async guardarPaciente(paciente: Paciente){

    await this.storage.guardarImagen(paciente.img).then( () =>{

      this.storage.obtenerImagen('images/' + paciente.img['name']).then(getImg1 => paciente.img = getImg1);

      this.storage.guardarImagen(paciente.img2).then( () =>{

        this.storage.obtenerImagen('images/' + paciente.img2['name']).then(getImg2 =>{
            paciente.img2 = getImg2

            const userRef = doc(collection(this.db, this.cUsuarios), paciente.id);
            return setDoc(userRef, {...paciente});
            
          });
      });
    })
  }

  async guardarEspecialista(especialista: Especialista){

    await this.storage.guardarImagen(especialista.img).then( () =>{

      this.storage.obtenerImagen('images/' + especialista.img['name']).then(getImg =>{
          especialista.img = getImg

          const userRef = doc(collection(this.db, this.cUsuarios), especialista.id);
          return setDoc(userRef, {...especialista});
          
        });
    });
  }

  async guardarAdministrador(administrador: Usuario){

    await this.storage.guardarImagen(administrador.img).then( () =>{

      this.storage.obtenerImagen('images/' + administrador.img['name']).then(getImg =>{
          administrador.img = getImg

          const userRef = doc(collection(this.db, this.cUsuarios), administrador.id);
          return setDoc(userRef, {...administrador});
          
        });
    });
  }

  async guardarEspecialidad(especialidad: string) {

    const docRef = await addDoc(collection(this.db, this.cEspecialidades), {especialidad});

    return await updateDoc(docRef, {
      id: docRef.id,
      especialidad: especialidad
    });
  }
  
  obtenerEspecialidades(): Observable<Array<string> | any> {
    const especialidadesRef = collection(this.db, this.cEspecialidades);
    const q = query(especialidadesRef, orderBy('especialidad', 'asc'));
    return collectionData(q,{ idField: 'id' }) ;
  }
}
