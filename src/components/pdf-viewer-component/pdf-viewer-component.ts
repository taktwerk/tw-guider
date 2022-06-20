import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DocumentViewer, DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Filesystem } from '@capacitor/filesystem';
import { DownloadService } from 'src/services/download-service';

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
    private iab: InAppBrowser,
    private downloadService: DownloadService
  ) { }

  dismiss() {
    this.modalController.dismiss();
    this.storage.set('pdfViewerComponentOpen', false)

  }

  ionViewDidEnter() {
    this.storage.set('pdfViewerComponentOpen', true)
  }

  async ngOnInit() {


    const resolvedPath = await this.downloadService.getResolvedNativeFilePath(this.url);

    Filesystem.readFile({ path: resolvedPath }).then((filebBase64) => {
      this.pdfUrl = 'data:application/pdf;base64,' + filebBase64.data;;
    });

  }
}
