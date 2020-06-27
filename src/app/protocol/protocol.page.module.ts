import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {ProtocolPage} from './protocol.page';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';
import {LanguageSelectorComponentModule} from '../../components/language-selector-component/language-selector-component.module';
import {TranslateModule} from '@ngx-translate/core';
import {MainPipe} from '../../pipes/main-pipe.module';
import {VirtualScrollerModule} from 'ngx-virtual-scroller';

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
        LanguageSelectorComponentModule,
        TranslateModule,
        MainPipe,
        VirtualScrollerModule
    ],
  exports: [
  ],
})
export class ProtocolPageModule {}