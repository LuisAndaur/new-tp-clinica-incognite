import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'siNo'
})
export class SiNoPipe implements PipeTransform {

  transform(value: any): any {
    debugger;
    return value ? 'Si' : 'No';;
  }

}
