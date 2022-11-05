import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringManipulate'
})
export class StringManipulatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return (value as String).replace('_PackagingLine', '');
  }

}
