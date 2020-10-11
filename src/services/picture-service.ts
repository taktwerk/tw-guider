import {Injectable} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PdfViewerComponent} from '../components/pdf-viewer-component/pdf-viewer-component';

/**
 * Download file class
 */
@Injectable()
export class PictureService {
    constructor(private modalController: ModalController) {}

    async openFile(url: string, fileTitle?: string) {
        const modal = await this.modalController.create({
            component: PdfViewerComponent,
            componentProps: {
                url,
                fileTitle
            },
            cssClass: "modal-fullscreen"
        });
        
        await modal.present();
    }
}
