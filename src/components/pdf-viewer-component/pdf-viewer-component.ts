import { Component, ViewChild, OnInit, Input, AfterViewInit } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ModalController } from '@ionic/angular';

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
export class PdfViewerComponent implements AfterViewInit {
  @Input() url: string;
  @Input() fileTitle: string;

  constructor(private modalController: ModalController, private fileOpener: FileOpener) {}

  dismiss() {
    this.modalController.dismiss();
  }

  ngAfterViewInit() {
    this.fileOpener
      .open(this.url, 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch((e) => console.log('Error opening file', e));

      this.dismiss();
  }
}
