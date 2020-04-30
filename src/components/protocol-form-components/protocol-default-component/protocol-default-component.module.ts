import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ProtocolDefaultComponent} from './protocol-default-component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    ProtocolDefaultComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  exports: [
      ProtocolDefaultComponent
  ],
})
export class ProtocolDefaultComponentModule {}
