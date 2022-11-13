import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  constructor(private datePipe: DatePipe) { }

  transformDate(date: any, sequence = 'MMM dd, yyyy') {
    return this.datePipe.transform(date, sequence);
  }

  static capitalizeFirstLetter(data: any) {
    return data.charAt(0).toUpperCase() + data.slice(1);
  }

  static capitalizeWords(string: string) {
    return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
  };

  static debounce(fn: any = null, delay = 1000) {
    let timer;
    return (() => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(), delay);
    })();
  };

  static downloadURI(uri: any, name: any) {
    let link: any = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link = null;
  }

  static numberWithCommasDecimal(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  static formatToCurrency(amount) {
    return (amount).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

}
