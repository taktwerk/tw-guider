import { NgModule } from '@angular/core';
import { ProfilePage } from './profile';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { ionMenuWithSyncIndicatorComponentModule } from 'src/components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { LanguageSelectorComponentModule } from 'src/components/language-selector-component/language-selector-component.module';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { SynchronizationComponentModule } from 'src/components/synchronization-component/synchronization-component.module';
import { MainPipe } from 'src/pipes/main-pipe.module';

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
