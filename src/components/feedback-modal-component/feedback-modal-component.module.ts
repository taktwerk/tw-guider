import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {SyncSpinnerComponentModule} from '../sync-spinner-component/sync-spinner-component.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SyncSpinnerComponentModule
  ],
  exports: [
  ],
})
export class FeedbackModalComponentModule {}
