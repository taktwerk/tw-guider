import { NgModule } from '@angular/core';
import {QrScannerComponent} from './qr-scanner-component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    QrScannerComponent,
  ],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
    ],
  exports: [
    QrScannerComponent
  ]
})
export class QrScannerComponentModule {}
