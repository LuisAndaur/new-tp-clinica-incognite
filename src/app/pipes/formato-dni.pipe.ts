import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dni'
})
export class FormatoDniPipe implements PipeTransform {

  transform(value: string): string {

    let primeraSeccion = value.slice(0, -6);
    let segundaSeccion = value.slice(-6, -3);
    let terceraSeccion = value.slice(-3);

    let dniFull = `${primeraSeccion}.${segundaSeccion}.${terceraSeccion}`;

    return dniFull;
  }

}
