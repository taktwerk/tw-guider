import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FeedbackPage} from './feedback.page';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';

@NgModule({
  declarations: [
    FeedbackPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: FeedbackPage
      }
    ]),
    SyncSpinnerComponentModule
  ],
  exports: [
  ],
})
export class FeedbackPageModule {}