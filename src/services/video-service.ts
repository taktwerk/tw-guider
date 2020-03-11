import {Injectable} from '@angular/core';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import {ModalController} from '@ionic/angular';
import {VideoModalComponent} from '../components/modals/video-modal-component/video-modal-component';
import {DownloadService} from './download-service';

/**
 * Download file class
 */
@Injectable()
export class VideoService {
    constructor(private streamingMedia: StreamingMedia,
                private modalController: ModalController,
                private downloadService: DownloadService) {}

    async playVideo(fileUrl: string) {
        console.log('playVideo, please');
        const modal = await this.modalController.create({
            component: VideoModalComponent,
            componentProps: {
                fileUrl: fileUrl,
            }
        });
        await modal.present();
    }
}
