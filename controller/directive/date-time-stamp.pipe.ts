import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'dateTimeStamp'
})
export class DateTimeStampPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(!value) {
      return;
    }
    return moment((value as string).substring(0, 19)).format('MM-DD hh:mm A');
  }

}
