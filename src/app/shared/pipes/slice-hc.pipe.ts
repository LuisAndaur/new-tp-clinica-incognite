import { Pipe, PipeTransform } from '@angular/core';
import { Turno } from '../models/turno.class';

@Pipe({
  name: 'sliceHc'
})
export class SliceHcPipe implements PipeTransform {

  transform(value: Turno[]): Turno[] {

    const hcSort = value.sort((a, b) => new Date(b.fecha).getTime() - (new Date(a.fecha)).getTime());

    if(hcSort.length > 3) {
      return hcSort.slice(0, 3);
    }

    return hcSort;
  }

}
