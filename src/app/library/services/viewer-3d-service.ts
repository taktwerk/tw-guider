import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Viewer3dModalComponent } from 'src/components/modals/viewer-3d-modal-component/viewer-3d-modal-component';
import * as THREE from 'three';

/**
 * Download file class
 */
@Injectable()
export class Viewer3dService {
    constructor(private modalController: ModalController) { }

    canvas: any;
    renderer: any;

    async openPopupWithRenderedFile(fileName: string, fileTitle?: string) {
        const modal = await this.modalController.create({
            component: Viewer3dModalComponent,
            componentProps: {
                fileName,
                fileTitle
            },
            cssClass: "modal-fullscreen"
        });
        await modal.present();
    }

    getGlobalCanvas() {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
        }
        return this.canvas;
    }

    getGlobalRenderer() {
        if (!this.renderer) {
            this.renderer = new THREE.WebGLRenderer(
                { canvas: this.getGlobalCanvas(), alpha: true, antialias: true }
            );
            this.renderer.physicallyCorrectLights = true;
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setScissorTest(true);
        }
        return this.renderer;
    }
}
