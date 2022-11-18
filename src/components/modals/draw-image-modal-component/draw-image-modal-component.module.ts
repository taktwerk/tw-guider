import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import { DrawImageModalComponent } from './draw-image-modal-component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [DrawImageModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule
  ],
  exports: []
})
export class DrawImageModalComponentModule {}
