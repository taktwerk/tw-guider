import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FeedbackPage } from './feedback.page';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';

@NgModule({
  declarations: [
    FeedbackPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: FeedbackPage
      }
    ]),
    SyncSpinnerComponentModule
  ],
})
export class FeedbackPageModule {}
