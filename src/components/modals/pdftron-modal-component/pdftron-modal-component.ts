import {AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

declare var PDFTron: any;
declare var PSPDFKit: any;
declare const WebViewer: any;

@Component({
  selector: 'pdftron-modal-component',
  templateUrl: 'pdftron-modal-component.html',
  styleUrls: ['pdftron-modal-component.scss']
})

export class PdftronModalComponent implements OnInit, OnDestroy {
    @Input() fileUrl: string;
    @Input() fileTitle: string;
    @ViewChild('viewer', { static: false }) viewer: ElementRef;
    wvInstance: any;

    constructor(private modalController: ModalController,
                private platform: Platform) {
    }

    dismiss() {
        this.modalController.dismiss();
    }

    backbuttonAction() {
        this.dismiss();
    }

    ngOnInit() {
        // this.platform.ready().then(async () => {
        //     this.backButtonSubscribe = this.platform.backButton.subscribeWithPriority(9999, () => {
        //         document.addEventListener('backbutton', () => this.backbuttonAction());
        //     });
        // });
    }

    initializePspdfkit(fileUrl, fileTitle) {
        PSPDFKit.present(fileUrl, {
            title: fileTitle,
            scrollDirection: PSPDFKit.PageScrollDirection.VERTICAL,
            scrollMode: PSPDFKit.ScrollMode.CONTINUOUS,
            useImmersiveMode: true
        });
    }

    initializePdftronNativeViewer(fileUrl) {
        const app = {
            // Application Constructor
            initialize: function() {
                document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
            },

            // deviceready Event Handler
            //
            // Bind any cordova events here. Common events are:
            // 'pause', 'resume', etc.
            onDeviceReady: function() {
                this.receivedEvent('deviceready');
            },

            onTopLeftButtonPressed: function () {
                console.log('onTopLeftButtonPressed');
            },

            onClose: function () {
                console.log('was close');
            },

            // Update DOM on a Received Event
            receivedEvent: function(id) {
                var parentElement = document.getElementById(id);
                var listeningElement = parentElement.querySelector('.listening');
                var receivedElement = parentElement.querySelector('.received');

                listeningElement.setAttribute('style', 'display:none;');
                receivedElement.setAttribute('style', 'display:block;');

                const viewerElement = document.getElementById('viewer');
                const viewer = new PDFTron.NativeViewer({
                    l: '<your-key-here>',
                    initialDoc: fileUrl,
                    // initialDoc: 'http://www.africau.edu/images/default/sample.pdf',
                    disabledElements: [
                        // hide elements as you wish
                    ]
                }, viewerElement);

                document.addEventListener('topLeftButtonPressed', this.onTopLeftButtonPressed.bind(this), false);
            }
        };

        app.initialize();
    }

    ngOnDestroy() {
        // this.backButtonSubscribe.unsubscribe();
        // document.removeEventListener('topLeftButtonPressed', () => {});
        // document.removeEventListener('topLeftButtonPressed', () => {});
    }
}
