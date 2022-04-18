import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ToastService } from '../../../services/toast-service';
import { StreamingMedia, StreamingVideoOptions } from '@awesome-cordova-plugins/streaming-media/ngx';
import { DownloadService } from '../../../services/download-service';
import { Storage } from '@ionic/storage-angular';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
    selector: 'video-modal-component',
    templateUrl: 'video-modal-component.html',
    styleUrls: ['video-modal-component.scss']
})

export class VideoModalComponent implements OnInit, OnDestroy {
    @ViewChild('video') video: ElementRef; // binds to #video in video.html
    videoElement: HTMLVideoElement;
    @Input() fileUrl: string;
    @Input() fileTitle: string;
    // backButtonSubscribe;

    constructor(private modalController: ModalController,
        private storage: Storage,

        private platform: Platform,
        private toastService: ToastService,
        private streamingMedia: StreamingMedia,
        private downloadService: DownloadService,
        private ngZone: NgZone) {
        //  document['ionicComponentRef'] = { name: 'video-modal-component', component: this, zone: ngZone };
    }

    dismiss() {
        this.modalController.dismiss();
        this.storage.set('VideoModalComponentOpen', false)
        console.log("dismiss", "VideoModalComponentOpen")

    }

    async playVideo() {
        try {
            this.videoElement = this.video.nativeElement;
            this.videoElement.src = this.downloadService.getWebviewFileSrc(this.fileUrl);
            this.videoElement.addEventListener('webkitfullscreenchange', () => {
                if (!document['webkitIsFullScreen']) {
                    this.dismiss();
                }
            });
            await this.videoElement.play();
        } catch (e) {
            this.openVideoViaMediaStreamingPlugin(this.fileUrl);
            /// in this plugin is not exist promise that why setTimeout
            setTimeout(() => this.dismiss(), 1000);
        }
    }

    canPlayVideoViaHtml5VideoTag() {
        return this.videoElement && this.videoElement.readyState;
    }

    ionViewDidEnter() {
        this.storage.set('VideoModalComponentOpen', true)
        if (!this.videoElement || this.videoElement.paused) {
            this.playVideo();
        }
    }

    openVideoViaMediaStreamingPlugin(fileUrl) {
        const options: StreamingVideoOptions = {
            successCallback: () => { console.log('Video played'); },
            errorCallback: (e) => {
                this.toastService.showToast('Sorry, can\'t open file', 'Error', 'danger');
            },
            controls: true,
            shouldAutoClose: false
        };
        this.streamingMedia.playVideo(fileUrl, options);
    }

    // backbuttonAction() {
    //     this.dismiss();
    // }

    ngOnInit() {
        this.platform.ready().then(async () => {
            // this.backButtonSubscribe = this.platform.backButton.subscribeWithPriority(9999, () => {
            //     document.addEventListener('backbutton', () => this.backbuttonAction());
            // });
        });
    }

    ngOnDestroy() {
        // document['ionicComponentRef'] = null;
        // this.backButtonSubscribe.unsubscribe();
        // document.removeEventListener('backbutton', () => { });
    }
}
