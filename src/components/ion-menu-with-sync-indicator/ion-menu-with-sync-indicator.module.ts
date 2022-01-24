import { NgModule } from '@angular/core';
import { ionMenuWithSyncIndicator } from './ion-menu-with-sync-indicator';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ionMenuWithSyncIndicator,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  exports: [
    ionMenuWithSyncIndicator
  ],
})
export class ionMenuWithSyncIndicatorComponentModule { }
