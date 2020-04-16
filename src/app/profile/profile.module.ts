import { NgModule } from '@angular/core';
import { ProfilePage } from './profile';
import {SynchronizationComponentModule} from '../../components/synchronization-component/synchronization-component.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';
import {FormsModule} from '@angular/forms';
import {LanguageSelectorComponentModule} from '../../components/language-selector-component/language-selector-component.module';
import {TranslateModule} from '@ngx-translate/core';
import {MainPipe} from '../../pipes/main-pipe.module';

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
        SyncSpinnerComponentModule,
        LanguageSelectorComponentModule,
        TranslateModule,
        MainPipe
    ]
})
export class ProfilePageModule {}
