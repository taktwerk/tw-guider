import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import {PdfViewerComponent} from './pdf-viewer-component';

@NgModule({
  declarations: [
    PdfViewerComponent,
  ],
    imports: [
        CommonModule,
        IonicModule,
        PdfJsViewerModule
    ],
  exports: [
    PdfViewerComponent
  ]
})
export class PdfViewerComponentModule {}
