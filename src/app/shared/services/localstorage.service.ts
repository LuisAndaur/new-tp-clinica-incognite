import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string){
    const item = localStorage.getItem(key);
    if (item != null){
      return JSON.parse(item);
    }
    return '';
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
