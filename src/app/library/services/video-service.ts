import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VideoModalComponent } from 'components/modals/video-modal-component/video-modal-component';

/**
 * Download file class
 */
@Injectable()
export class VideoService {
    constructor(private modalController: ModalController) { }

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
