import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders as Headers, HttpClient } from '@angular/common/http';

import { DownloadService } from '../../services/download-service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DocumentViewer, DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer/ngx';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'pdf-viewer-component',
  templateUrl: 'pdf-viewer-component.html'
})
export class PdfViewerComponent implements OnInit {
  @Input() url: string;
  @ViewChild('viewer', { static: true }) public embeddedPdfViewer;

  public pdfUrl = '';

  constructor(
    private document: DocumentViewer,
    private storage: Storage,

    private modalController: ModalController,
    private http: HttpClient,
    private download: DownloadService
  ) { }

  dismiss() {
    this.modalController.dismiss();
    this.storage.set('pdfViewerComponentOpen', false)

  }

  ionViewDidEnter() {
    this.storage.set('pdfViewerComponentOpen', true)
  }

  async ngOnInit() {

    const options: DocumentViewerOptions = {
      title: 'PDF'
    }

    this.document.viewDocument(this.url, 'application/pdf', options)
    // const reqOptions = {
    //   method: 'get' as any,
    //   responseType: 'blob' as any,
    //   headers: {
    //     accept: 'application/pdf'
    //   }
    // };

    // const headerObject: any = {
    //   'Content-Type': 'application/pdf'
    // };

    // console.log('headerObject', headerObject);

    // const headers = new Headers(headerObject);
    // console.log(this.url);
    // // this.url = this.download.getWebviewFileSrc(this.url);
    // console.log(this.url)
    // this.embeddedPdfViewer.pdfSrc = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    // this.embeddedPdfViewer.refresh();
  }
}
