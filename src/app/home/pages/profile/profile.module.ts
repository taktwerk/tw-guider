import { NgModule } from '@angular/core';
import { ProfilePage } from './profile';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { MainPipe } from 'app/library/pipes/main-pipe.module';
import { ionMenuWithSyncIndicatorComponentModule } from 'components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { LanguageSelectorComponentModule } from 'components/language-selector-component/language-selector-component.module';
import { SyncSpinnerComponentModule } from 'components/sync-spinner-component/sync-spinner-component.module';
import { SynchronizationComponentModule } from 'components/synchronization-component/synchronization-component.module';

@NgModule({
  declarations: [
    ProfilePage,
  ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProfilePage
            }
        ]),
        SynchronizationComponentModule,
    ionMenuWithSyncIndicatorComponentModule,

        SyncSpinnerComponentModule,
        LanguageSelectorComponentModule,
        TranslateModule,
        MainPipe
    ]
})
export class ProfilePageModule {}
