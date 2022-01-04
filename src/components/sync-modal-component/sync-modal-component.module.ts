import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SyncModalComponent } from './sync-modal-component';
import { TranslateModule } from '@ngx-translate/core';
import { SyncSpinnerComponentModule } from '../sync-spinner-component/sync-spinner-component.module';
import { ProgressBarModule } from 'components/progress-bar/progress-bar.module';

@NgModule({
  declarations: [SyncModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    SyncSpinnerComponentModule,
    ProgressBarModule
  ],
  exports: [
  ],
})
export class SyncModalComponentModule { }
