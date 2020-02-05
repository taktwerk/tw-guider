import { NgModule } from '@angular/core';
import {SynchronizationComponent} from './synchronization-component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    SynchronizationComponent,
  ],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
    ],
  exports: [
    SynchronizationComponent
  ]
})
export class SynchronizationComponentModule {}
