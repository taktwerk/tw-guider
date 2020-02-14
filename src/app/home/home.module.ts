import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';
import {LanguageSelectorComponentModule} from '../../components/language-selector-component/language-selector-component.module';
import {TranslateModule} from '@ngx-translate/core';
import {QrScannerComponentModule} from '../../components/qr-scanner-component/qr-scanner-component.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ]),
        SyncSpinnerComponentModule,
        LanguageSelectorComponentModule,
        TranslateModule.forChild(),
        QrScannerComponentModule
    ],
  declarations: [HomePage]
})
export class HomePageModule {}
