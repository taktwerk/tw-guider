import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FeedbackAddEditPage } from './feedback-add-edit.page';
import { TranslateModule } from '@ngx-translate/core';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { SharedModule } from 'src/app/shared/shared.module';
import { HtmlDescriptionComponentModule } from 'src/components/html-description/html-description-component.module';
import { ionMenuWithSyncIndicatorComponentModule } from 'src/components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { LanguageSelectorComponentModule } from 'src/components/language-selector-component/language-selector-component.module';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { MainPipe } from 'src/pipes/main-pipe.module';
import { AssetviewComponentModule } from 'src/components/assetview/assetview.module';

@NgModule({
    declarations: [
        FeedbackAddEditPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: FeedbackAddEditPage
            }
        ]),
        SyncSpinnerComponentModule,
        ionMenuWithSyncIndicatorComponentModule,
        HtmlDescriptionComponentModule,
        MainPipe,
        LanguageSelectorComponentModule,
        TranslateModule,
        AssetviewComponentModule,
        SharedModule
    ],
    providers: [PhotoViewer, File]
})

export class FeedbackAddEditModule { }
