import { CommonModule } from '@angular/common';
import { DocumentViewer } from '@awesome-cordova-plugins/document-viewer/ngx';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { PdfViewerComponent } from './pdf-viewer-component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    PdfViewerComponent
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
