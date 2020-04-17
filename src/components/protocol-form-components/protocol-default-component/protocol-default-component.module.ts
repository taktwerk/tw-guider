import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ProtocolDefaultComponent} from './protocol-default-component';

@NgModule({
  declarations: [
    ProtocolDefaultComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
      ProtocolDefaultComponent
  ],
})
export class ProtocolDefaultComponentModule {}
