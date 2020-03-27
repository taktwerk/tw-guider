import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {PdftronModalComponent} from './pdftron-modal-component';

@NgModule({
  declarations: [
    PdftronModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    PdftronModalComponent
  ],
})
export class PdftronModalComponentModule {}
