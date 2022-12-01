import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavCtrlService {

  navigationData: any = null;
  itemDetail = null;
  popupData = null;
  constructor(private modalCtrl: ModalController, public navCtrl: NavController, public popoverCtrl: PopoverController, private route: ActivatedRoute) {}
  params() {
    return this.route.snapshot.params;
  }

  goTo(url: string, data: any = null, direction: 'forward' | 'back' | 'root' = 'forward') {
    if (data != null) {
      this.navigationData = data;
    }
    switch (direction) {
      case 'forward': {
        this.navCtrl.navigateForward(url);
        break;
      }
      case 'back': {
        this.navCtrl.navigateBack(url);
        break;
      }
      default: {
        this.navCtrl.navigateRoot(url);
      }
    }
  }

  async popup(component: any, data: any = null, item = null, cssClass = 'myModal') {
    if (data != null) {
      this.navigationData = data;
    }
    if (item != null) {
      this.itemDetail = item;
    }
    const modal = await this.modalCtrl.create({ component, cssClass });
    await modal.present();
    return modal;
  }
  async popupOver(component: any, data = null, event: any) {
    if (data != null) {
      this.popupData = data;
    }
    const modal = await this.popoverCtrl.create({
      component,
      translucent: true,
      event
    });
    await modal.present();
  }

  async closePopup(data = null) {
    await this.modalCtrl.dismiss(data);
  }

}
