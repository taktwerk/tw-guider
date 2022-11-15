import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {

  photoframe: any = {
    show: false,
    url: null,
    title: ''
  };

  videoframe: any = {
    show: false,
    url: null,
    title: ''
  };

  pdfframe: any = {
    show: false,
    url: null,
    title: ''
  };

  constructor() { }
}
