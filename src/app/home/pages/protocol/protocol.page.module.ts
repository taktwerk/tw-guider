import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ProtocolPage } from './protocol.page';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MainPipe } from 'app/library/pipes/main-pipe.module';
import { ionMenuWithSyncIndicatorComponentModule } from 'components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { LanguageSelectorComponentModule } from 'components/language-selector-component/language-selector-component.module';
import { SyncSpinnerComponentModule } from 'components/sync-spinner-component/sync-spinner-component.module';

@NgModule({
  declarations: [
    ProtocolPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProtocolPage
      }
    ]),
    SyncSpinnerComponentModule,
    ionMenuWithSyncIndicatorComponentModule,
    LanguageSelectorComponentModule,
    TranslateModule,
    MainPipe
  ],
  exports: [
  ],
})
export class ProtocolPageModule { }
