import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuidecapturePageRoutingModule } from './guidecapture-routing.module';

import { GuidecapturePage } from './guidecapture.page';
import { TranslateModule } from '@ngx-translate/core';
import { GuideListComponentModule } from '../../components/guide-list-component/guide-list-component.module';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuidecapturePageRoutingModule,
    ionMenuWithSyncIndicatorComponentModule,

    TranslateModule,
    GuideListComponentModule,
    SyncSpinnerComponentModule
  ],
  declarations: [GuidecapturePage]
})
export class GuidecapturePageModule {}
