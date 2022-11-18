import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { CategoriesListPage } from './categories-list.page';
import { SyncSpinnerComponentModule } from '../../../../components/sync-spinner-component/sync-spinner-component.module';
import { HtmlDescriptionComponentModule } from '../../../../components/html-description/html-description-component.module';
import { LanguageSelectorComponentModule } from '../../../../components/language-selector-component/language-selector-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { GuideListComponentModule } from '../../../../components/guide-list-component/guide-list-component.module';
import { ionMenuWithSyncIndicatorComponentModule } from '../../../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { MainPipe } from 'app/library/pipes/main-pipe.module';
import { SyncModalComponentModule } from 'components/sync-modal-component/sync-modal-component.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: CategoriesListPage
            }
        ]),
        SyncModalComponentModule,
        SyncSpinnerComponentModule,
        ionMenuWithSyncIndicatorComponentModule,
        MainPipe,
        HtmlDescriptionComponentModule,
        LanguageSelectorComponentModule,
        TranslateModule,
        GuideListComponentModule,
    ],
    declarations: [CategoriesListPage],
    providers: [File, PhotoViewer]
})
export class CategoriesListModule { }