import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ToastService } from '../../../services/toast-service';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { DownloadService } from '../../../services/download-service';
import { Viewer3dModelComponent } from '../../viewer-3d-model-component/viewer-3d-model-component';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
    selector: 'viewer-3d-modal-component',
    templateUrl: 'viewer-3d-modal-component.html',
    styleUrls: ['viewer-3d-modal-component.scss']
})

export class Viewer3dModalComponent implements OnInit, OnDestroy {
    @Input() fileName: string;
    @Input() fileTitle: string;
    @ViewChild('viewer3d') viewer3d: Viewer3dModelComponent;


    constructor(private modalController: ModalController, private storage: Storage, private platform: Platform) { }

    dismiss() {
        this.viewer3d.cancelRender();
        this.modalController.dismiss();
        this.storage.set('Viewer3dModalComponentOpen', false);
    }

    ionViewDidEnter() {
        this.storage.set('Viewer3dModalComponentOpen', true);
    }

    backbuttonAction() {
        this.dismiss();
    }

    ngOnInit() {
        this.platform.ready().then(async () => {

        });
    }

    ngOnDestroy() {
        this.viewer3d.cancelRender();
    }
}
