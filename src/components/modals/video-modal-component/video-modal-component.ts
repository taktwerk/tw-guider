import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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
  selector: 'video-modal-component',
  templateUrl: 'video-modal-component.html',
  styleUrls: ['video-modal-component.scss']
})

export class VideoModalComponent {
    @ViewChild('video', {static: false}) video: ElementRef; // binds to #video in video.html
    videoElement: HTMLVideoElement;
    @Input() fileUrl: string;

    constructor(private modalController: ModalController,
                private platform: Platform,
                private toastService: ToastService,
                private streamingMedia: StreamingMedia,
                private downloadService: DownloadService) {}

    dismiss() {
        this.modalController.dismiss();
    }

    async playVideo() {
        try {
            this.videoElement = this.video.nativeElement;
            this.videoElement.src = this.downloadService.getWebviewFileSrc(this.fileUrl);
            await this.videoElement.play();
        } catch (e) {
            this.openVideoViaMediaStreamingPlugin(this.fileUrl);
            /// in this plugin is not exist promise
            setTimeout(() => this.dismiss(), 1000);
        }
    }

    canPlayVideoViaHtml5VideoTag() {
        return this.videoElement && this.videoElement.readyState;
    }

    ionViewDidEnter() {
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
}
