import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[myEstado]'
})
export class EstadoDirective {

  constructor(elementRef: ElementRef, renderer: Renderer2) {

    setTimeout(function(){

      switch (elementRef.nativeElement.textContent) {
        case " PENDIENTE ":
          renderer.setStyle(elementRef.nativeElement, 'color', 'gold');
          break;
        case " ACEPTADO ":
          renderer.setStyle(elementRef.nativeElement, 'color', 'green');
          break;
        case " CANCELADO ":
          renderer.setStyle(elementRef.nativeElement, 'color', 'crimson');
          break;
        case " FINALIZADO ":
          renderer.setStyle(elementRef.nativeElement, 'color', 'darkgrey');
          break;
        case " RECHAZADO ":
          renderer.setStyle(elementRef.nativeElement, 'color', 'red');
          break;
          case " REALIZADO ":
          renderer.setStyle(elementRef.nativeElement, 'color', 'chartreuse');
          break;
      }
    }, 100);


  }

}
