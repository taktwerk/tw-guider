import {Injectable} from '@angular/core';

import {ToastController} from '@ionic/angular';
import {TranslateConfigService} from './translate-config.service';

@Injectable()
export class ToastService {
  constructor(
      private toastCtrl: ToastController,
      private translateConfigService: TranslateConfigService
  ) {}

  previousToast:any = null;

  async showToast(msg?: string, header?: string , toastColor?: string, withLocalization: boolean = true) {
    if (!msg) {
        msg = 'Fehler: Keine Verbindung zum Server.';
    }
    if (withLocalization) {
        msg = await this.translateConfigService.translate(msg);
        if (header) {
            header = await this.translateConfigService.translate(header);
        }
    }

    const toastOptions = {
        header: header,
        showCloseButton: true,
        closeButtonText: 'OK',
        message: msg,
        duration: 3000,
        color: toastColor
    };

    this.toastCtrl.create(toastOptions).then((toast) => {
        if (this.previousToast) {
            this.previousToast.dismiss();
        }

        toast.present().then(() => {
            this.previousToast = toast;
        });
        this.previousToast = toast;
    });
  }
}
