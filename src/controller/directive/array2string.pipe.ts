import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'array2String'
})
export class Array2StringPipe implements PipeTransform {

  transform(value: Array<any>, ...args: unknown[]): unknown {
    if(Array.isArray(value)) return value.join(', ');

    return value;
  }

}
