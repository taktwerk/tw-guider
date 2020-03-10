import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {VideoModalComponent} from './video-modal-component';

@NgModule({
  declarations: [
    VideoModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    VideoModalComponent
  ],
})
export class VideoModalComponentModule {}
