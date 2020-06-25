import {Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalController, Platform} from '@ionic/angular';
import {ToastService} from '../../../services/toast-service';
import {StreamingMedia, StreamingVideoOptions} from '@ionic-native/streaming-media/ngx';
import {DownloadService} from '../../../services/download-service';

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
    @Input() fileUrl: string;
    @Input() fileTitle: string;
    backButtonSubscribe;

    constructor(private modalController: ModalController,
                private platform: Platform,
                private toastService: ToastService,
                private streamingMedia: StreamingMedia,
                private downloadService: DownloadService,
                private ngZone: NgZone) {
        //document['ionicComponentRef'] = {name: 'video-modal-component', component: this, zone: ngZone};
    }

    dismiss() {
        this.modalController.dismiss();
    }

    ionViewDidEnter() {
        ///
    }

    backbuttonAction() {
        this.dismiss();
    }

    ngOnInit() {
        this.platform.ready().then(async () => {

        });
    }

    ngOnDestroy() {
    }
}
