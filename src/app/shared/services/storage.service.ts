import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  guardarImagen(file:any){
    
    const storage = getStorage();
    const imgRef = ref(storage, "images/" + file.name);

    return uploadBytes(imgRef, file);
  }

  async obtenerImagen(path:string){

    let imagen = null;
    const storage = getStorage();
    const imagRef = ref(storage, 'images');

    await listAll(imagRef).then( m =>{

        for(let i = 0; i < m.items.length; i++){

          if(m.items[i].fullPath == path){
            imagen = getDownloadURL(m.items[i]);
            break;
          }
        }
      })
      
    return imagen;
  }
}
