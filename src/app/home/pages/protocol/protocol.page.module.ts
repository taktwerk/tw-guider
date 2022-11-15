import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ProtocolPage } from './protocol.page';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ionMenuWithSyncIndicatorComponentModule } from 'src/components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { LanguageSelectorComponentModule } from 'src/components/language-selector-component/language-selector-component.module';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { MainPipe } from 'app/library/pipes/main-pipe.module';

@NgModule({
  declarations: [
    ProtocolPage
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
