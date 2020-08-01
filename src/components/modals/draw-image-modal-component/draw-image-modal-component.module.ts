import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {DrawImageModalComponent} from './draw-image-modal-component';

@NgModule({
  declarations: [
    DrawImageModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    DrawImageModalComponent
  ],
})
export class DrawImageModalComponentModule {}
