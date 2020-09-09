import {Injectable} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PdfViewerComponent} from '../components/pdf-viewer-component/pdf-viewer-component';
import { InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

/**
 * Download file class
 */
@Injectable()
export class PdfViewerService {
    constructor(private modalController: ModalController) {}

    async open(url: string, browser: InAppBrowserObject) {
        console.log('opennnnn modall');
        const modal = await this.modalController.create({
            component: PdfViewerComponent,
            componentProps: {
                url,
                browser
            },
            cssClass: "modal-fullscreen"
        });
        
        await modal.present();
    }
}
