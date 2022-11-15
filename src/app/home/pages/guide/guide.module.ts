import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { GuidePage } from './guide.page';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssetviewComponentModule } from 'src/components/assetview/assetview.module';
import { GuideStepContentComponentModule } from 'src/components/guide-step-content-component/guide-step-content-component.module';
import { GuideinfoPageModule } from 'src/components/guideinfo/guideinfo.module';
import { HtmlDescriptionComponentModule } from 'src/components/html-description/html-description-component.module';
import { ionMenuWithSyncIndicatorComponentModule } from 'src/components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { LanguageSelectorComponentModule } from 'src/components/language-selector-component/language-selector-component.module';
import { MenupopoverPageModule } from 'src/components/menupopover/menupopover.module';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { Viewer3dModelComponentModule } from 'src/components/viewer-3d-model-component/viewer-3d-model-component.module';
import { MainPipe } from 'src/pipes/main-pipe.module';

@NgModule({
    declarations: [
        GuidePage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([{ path: '', component: GuidePage }]),
        FontAwesomeModule,
        SyncSpinnerComponentModule,
        ionMenuWithSyncIndicatorComponentModule,
        HtmlDescriptionComponentModule,
        MainPipe,
        LanguageSelectorComponentModule,
        TranslateModule,
        Viewer3dModelComponentModule,
        GuideStepContentComponentModule,
        GuideinfoPageModule,
        MenupopoverPageModule,
        AssetviewComponentModule,
        SharedModule
        // Chooser,
        // IOSFilePicker,
        // FilePath
    ],
    providers: [
        File,
        PhotoViewer
    ]
})

export class GuidePageModule { }
