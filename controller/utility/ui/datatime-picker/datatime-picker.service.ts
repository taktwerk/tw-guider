import { Injectable } from '@angular/core';
import { NavigationRouteService } from 'src/controller/services/navigation-route/navigation-route.service';
import { DatatimePickerComponent } from './datatime-picker.component';

@Injectable({
  providedIn: 'root'
})
export class DatatimePickerService {

  constructor(private navCtrl: NavigationRouteService) { }

  open() {
    this.navCtrl.popup(DatatimePickerComponent, null, null, 'content-fit-popup')
  }

}
