import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[decimal]'
})
export class DecimalDirective {

  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private teclaEspecial: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(this.el.nativeElement.value);

    if (this.teclaEspecial.indexOf(event.key) !== -1) {
      return;
    }
    let actual: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const next: string = [actual.slice(0, position), event.key == 'Decimal' ? '.' : event.key, actual.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

}
