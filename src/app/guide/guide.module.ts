import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { GuidePage } from './guide.page';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';
import {FeedbackModalComponentModule} from '../../components/feedback-modal-component/feedback-modal-component.module';

@NgModule({
  declarations: [
      GuidePage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: GuidePage
      }
    ]),
    SyncSpinnerComponentModule,
    FeedbackModalComponentModule
  ],
})
export class GuidePageModule {}
