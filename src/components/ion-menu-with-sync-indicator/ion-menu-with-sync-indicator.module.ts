import { NgModule } from '@angular/core';
import { ionMenuWithSyncIndicator } from './ion-menu-with-sync-indicator';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ionMenuWithSyncIndicator,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ionMenuWithSyncIndicator
  ],
})
export class ionMenuWithSyncIndicatorComponentModule { }
