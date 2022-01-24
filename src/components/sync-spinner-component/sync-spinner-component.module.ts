import { NgModule } from '@angular/core';
import { SyncSpinnerComponent } from './sync-spinner-component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SyncSpinnerComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  exports: [
    SyncSpinnerComponent
  ],
})
export class SyncSpinnerComponentModule { }
