import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DrawImageModalComponent } from '../components/modals/draw-image-modal-component/draw-image-modal-component';

/**
 * Download file class
 */
@Injectable()
export class DrawImageService {
    constructor(private modalController: ModalController) { }

    async open(fileUrl: any, fileTitle?: string, modelName?: string, saveName?: string) {
        console.log('open draw image service');
        const modal = await this.modalController.create({
            component: DrawImageModalComponent,
            componentProps: {
                fileUrl,
                fileTitle,
                modelName,
                saveName
            },
            cssClass: "modal-fullscreen"
        });
        await modal.present();
    }
}
