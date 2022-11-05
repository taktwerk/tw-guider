import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  loading!: HTMLIonLoadingElement;

  spinners: Array<HTMLIonLoadingElement> = [];

  constructor(private loadingController: LoadingController) {}

  async start(message = 'Please wait') {
    const loader = await this.loadingController.create({
      message
    });

    this.spinners.push(loader);
    await loader.present();
    return loader;
  }

  async stop(loader: any) {
    const index = this.spinners.indexOf(loader);
    this.spinners.splice(index, 1);

    if (loader) {
      loader.dismiss();
    }
  }

  async stopAll() {
    if (this.spinners.length > 0) {
      const loader: any = this.spinners.pop();
      loader.dismiss();

      if (this.spinners.length > 0) {
        this.stopAll();
      }
    }
  }
}
