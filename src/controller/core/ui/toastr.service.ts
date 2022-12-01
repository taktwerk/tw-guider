import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor(private alertCtrl: AlertController, public toast: ToastController) { }

  async alert( message: string =  'Hi, I am alert', title: string = 'Alert', buttons: Array<any> = ['OK']) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: '',
      message: message,
      buttons: buttons,
    });

    await alert.present();
  }

  error(msg: string) {
    this.present(msg);
  }

  success(msg: string) {
    this.present(msg);
  }

  info(msg: string) {
    this.present(msg);
  }

  private present(msg: string) {
    this.toast.create({
      message: msg,
      duration: 2000
    }).then(toast => {
      toast.present();
    });
  }
}
