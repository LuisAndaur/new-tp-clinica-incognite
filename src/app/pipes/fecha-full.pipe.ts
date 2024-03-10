import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFull'
})
export class FechaFullPipe implements PipeTransform {

  transform(date: number): string {

    let inputDate = new Date();
    inputDate.setTime(date);

    if (!inputDate) {
      return '';
    }

    const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

    const diaSemana = diasSemana[inputDate.getDay()];
    const diaMes = inputDate.getDate();
    const mes = meses[inputDate.getMonth()];
    const ano = inputDate.getFullYear();

    return `${diaSemana}, ${diaMes} DE ${mes} DE ${ano}`;
  }

}
