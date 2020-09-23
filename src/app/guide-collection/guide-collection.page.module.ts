import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {GuideCollectionPage} from './guide-collection.page';
import {SyncSpinnerComponentModule} from '../../components/sync-spinner-component/sync-spinner-component.module';
import {LanguageSelectorComponentModule} from '../../components/language-selector-component/language-selector-component.module';
import {TranslateModule} from '@ngx-translate/core';
import {MainPipe} from '../../pipes/main-pipe.module';
import {GuideListComponentModule} from "../../components/guide-list-component/guide-list-component.module";

@NgModule({
  declarations: [
      GuideCollectionPage
  ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: GuideCollectionPage
            }
        ]),
        SyncSpinnerComponentModule,
        LanguageSelectorComponentModule,
        TranslateModule,
        MainPipe,
        GuideListComponentModule
    ],
  exports: [
  ],
})
export class GuideCollectionModule {}
