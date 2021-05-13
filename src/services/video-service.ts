import { Injectable } from '@angular/core';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { ModalController } from '@ionic/angular';
import { VideoModalComponent } from '../components/modals/video-modal-component/video-modal-component';
import { DownloadService } from './download-service';

/**
 * Download file class
 */
@Injectable()
export class VideoService {
    constructor(private streamingMedia: StreamingMedia,
        private modalController: ModalController,
        private downloadService: DownloadService) { }

    async playVideo(fileUrl: string, fileTitle?: string) {
        const modal = await this.modalController.create({
            component: VideoModalComponent,
            componentProps: {
                fileUrl,
                fileTitle
            },
            cssClass: "modal-fullscreen"
        });
        await modal.present();
    }
}
