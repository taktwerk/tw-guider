import { Component, ViewChild, OnInit, Input } from '@angular/core';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
import {ModalController} from '@ionic/angular';
import {DownloadService} from '../../services/download-service';
import { map } from 'rxjs/operators';
import { Capacitor, Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

const { Filesystem } = Plugins;

@Component({
  selector: 'pdf-viewer-component',
  templateUrl: 'pdf-viewer-component.html',
})
export class PdfViewerComponent implements OnInit {
    @Input() url: string;
    @ViewChild('viewer', { static: true }) public embeddedPdfViewer;

    public pdfUrl = '';

    constructor(
       private modalController: ModalController,
       private http: HttpClient,
       private download: DownloadService
   ) {}

   dismiss() {
    this.modalController.dismiss();
   }

    async ngOnInit() {
     const reqOptions = {
        method: 'get' as any,
        responseType: 'blob' as any,
        headers: {
          accept: 'application/pdf'
        }
      };

     const headerObject: any = {
       'Content-Type': 'application/pdf'
     };

     console.log('headerObject', headerObject);
    
     const headers = new Headers(headerObject);

     this.url = this.download.getWebviewFileSrc(this.url);
     this.embeddedPdfViewer.pdfSrc = this.url;
     this.embeddedPdfViewer.refresh();
    }
}
