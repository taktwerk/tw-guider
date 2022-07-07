import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LanguageSelectorComponentModule } from '../../components/language-selector-component/language-selector-component.module';
import { MainPipe } from '../../pipes/main-pipe.module';
import { NgModule } from '@angular/core';
import { ProtocolPage } from './protocol.page';
import { RouterModule } from '@angular/router';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';

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
