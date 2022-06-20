import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PdfViewerComponent } from './pdf-viewer-component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { PDFViewerComponent } from '../pdf-viewer/pdf-viewer.component';

@NgModule({
  declarations: [
    PdfViewerComponent, PDFViewerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    PdfViewerModule
  ],
  providers: [DocumentViewer],
  exports: [
    PdfViewerComponent
  ]
})
export class PdfViewerComponentModule { }
