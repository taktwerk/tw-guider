import {Injectable} from '@angular/core';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import {ModalController} from '@ionic/angular';
import {VideoModalComponent} from '../components/modals/video-modal-component/video-modal-component';
import {DownloadService} from './download-service';
import {PdftronModalComponent} from '../components/modals/pdftron-modal-component/pdftron-modal-component';

/**
 * Download file class
 */

declare var PSPDFKit: any;

@Injectable()
export class PictureService {
    constructor(private streamingMedia: StreamingMedia,
                private modalController: ModalController,
                private downloadService: DownloadService) {}

    async openFile(fileUrl: string, fileTitle?: string) {
        this.initializePspdfkit(fileUrl, fileTitle);
        // const modal = await this.modalController.create({
        //     component: PdftronModalComponent,
        //     componentProps: {
        //         fileUrl,
        //         fileTitle
        //     }
        // });
        // await modal.present();
    }

    async openFileAsset(fileUrl: string, fileTitle?: string) {
        PSPDFKit.presentFromAssets(fileUrl, {
            title: fileTitle,
            scrollDirection: PSPDFKit.PageScrollDirection.VERTICAL,
            scrollMode: PSPDFKit.ScrollMode.CONTINUOUS,
            useImmersiveMode: true
        });
    }

    initializePspdfkit(fileUrl, fileTitle) {
        PSPDFKit.present(fileUrl, {
            title: fileTitle,
            scrollDirection: PSPDFKit.PageScrollDirection.VERTICAL,
            scrollMode: PSPDFKit.ScrollMode.CONTINUOUS,
            useImmersiveMode: true
        });
    }
}
