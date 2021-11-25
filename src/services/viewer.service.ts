import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewerService {

  photoframe = {
    show: false,
    url: null,
    title: ''
  };

  videoframe = {
    show: false,
    url: null,
    title: ''
  };

  constructor() { }
}
