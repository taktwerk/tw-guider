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

    ngOnInit(): void {
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

      // this.http.get(this.url, {responseType: 'blob'})
      //   .pipe(
      //         map((result: any) => {
      //             return result;
      //         })
      //     )
      //   .subscribe(
      //     (res) => {
      //       this.embeddedPdfViewer.pdfSrc = res;
      //       this.embeddedPdfViewer.refresh();
      //     }
      //   );



      // const modelFile = await Filesystem.readFile({ path: this.url });
      // var binary_string = window.atob(modelFile.data);
      // var len = binary_string.length;
      // var bytes = new Uint8Array(len);
      // for (var i = 0; i < len; i++) {
      //     bytes[i] = binary_string.charCodeAt(i);
      // }
      // this.embeddedPdfViewer.pdfSrc = bytes;
      // this.embeddedPdfViewer.refresh();
        console.log('window', window);
        //    
          this.http.get(this.url, {responseType: 'blob'})
           .toPromise()
          .then((response) => {
            this.embeddedPdfViewer.pdfSrc = response;
              this.embeddedPdfViewer.refresh();
            console.log('this.embeddedPdfViewer.pdfSrc', this.embeddedPdfViewer);
            let reader = new FileReader();
            const zoneOriginalInstance = (reader as any)["__zone_symbol__originalInstance"];
            reader = zoneOriginalInstance || reader;
            reader.onloadend = (() => {
              const base64data = reader.result;
              this.embeddedPdfViewer.pdfSrc = base64data;
              this.embeddedPdfViewer.refresh();
            });
            reader.readAsDataURL(response);
        }, (error) => {
          console.log('errrrrooooorrr', error);
        });
    }
}
