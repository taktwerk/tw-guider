import { NgModule } from '@angular/core';
import {DefaultFilePreviewComponent} from './default-file-preview-component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    DefaultFilePreviewComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    DefaultFilePreviewComponent
  ],
})
export class DefaultFilePreviewComponentModule {}
