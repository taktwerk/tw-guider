import { AssetviewComponentModule } from '../../components/assetview/assetview.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FeedbackAddEditPage } from './feedback-add-edit.page';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { MainPipe } from '../../pipes/main-pipe.module';
import { HtmlDescriptionComponentModule } from '../../components/html-description/html-description-component.module';
import { LanguageSelectorComponentModule } from '../../components/language-selector-component/language-selector-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { SharedModule } from '../../app/shared/shared.module';

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
})

export class FeedbackAddEditModule { }
