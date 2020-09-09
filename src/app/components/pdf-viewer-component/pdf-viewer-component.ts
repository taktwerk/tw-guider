import { Component, ViewChild, OnInit, Input } from '@angular/core';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import {ModalController} from '@ionic/angular';
import { InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'pdf-viewer-component',
  templateUrl: 'pdf-viewer-component.html',
})
export class PdfViewerComponent implements OnInit {
    @Input() url: string;
    @Input() browser: InAppBrowserObject;
    @ViewChild('viewer', { static: false }) public embeddedPdfViewer;

    public pdfUrl = '';

    constructor(
       private modalController: ModalController,
       private http: HTTP
   ) {}

   dismiss() {
    this.browser.show();
    this.modalController.dismiss();
   }

    ngOnInit(): void {
     const reqOptions = {
        method: 'get' as any,
        responseType: 'blob' as any,
        headers: {
          accept: 'application/pdf'
        }
      };

      this.http.sendRequest(this.url, reqOptions)
        .then((response) => {
          this.embeddedPdfViewer.pdfSrc = response.data;
          this.embeddedPdfViewer.refresh();
        });
    }
}
