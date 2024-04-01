import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';
import { Usuario } from '../models/usuario.class';
import { LocalstorageService } from '../services/localstorage.service';

@Directive({
  selector: '[resaltar]'
})
export class ResaltarDirective {

  currentUser!: Usuario;

  constructor(private local: LocalstorageService){
    this.currentUser = this.local.getItem('usuario');
   }

  @HostBinding('style.backgroundColor') background:string = 'cornsilk';

  @HostListener('mouseenter') mouseenter(){
    this.background = 'greenyellow';
  }

  @HostListener('mouseleave') mouseleave(){
    this.background = 'cornsilk';
  }
}
