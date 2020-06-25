import {Injectable} from '@angular/core';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import {ModalController} from '@ionic/angular';
import {VideoModalComponent} from '../components/modals/video-modal-component/video-modal-component';
import {DownloadService} from './download-service';
import {Viewer3dModalComponent} from "../components/modals/viewer-3d-modal-component/viewer-3d-modal-component";

/**
 * Download file class
 */
@Injectable()
export class Viewer3dService {
    constructor(private streamingMedia: StreamingMedia,
                private modalController: ModalController) {}

    async openPopupWithRenderedFile(fileUrl: string, fileTitle?: string) {
        const modal = await this.modalController.create({
            component: Viewer3dModalComponent,
            componentProps: {
                fileUrl,
                fileTitle
            }
        });
        await modal.present();
    }
}
