import { NgModule } from '@angular/core';
import {SyncSpinnerComponent} from './sync-spinner-component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    SyncSpinnerComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    SyncSpinnerComponent
  ]
})
export class SyncSpinnerComponentModule {}
