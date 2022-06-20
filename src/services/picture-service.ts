import { Injectable } from '@angular/core';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { PdfViewerComponent } from '../components/pdf-viewer-component/pdf-viewer-component';

/**
 * Download file class
 */
@Injectable()
export class PictureService {

    constructor(private modalController: ModalController, private document: DocumentViewer, private platform: Platform) { }

    async openFile(url: string, fileTitle?: string) {

        if (this.platform.is('ios')) {
            return this.document.viewDocument(url, 'application/pdf', { title: fileTitle });
        }

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
