import { MenupopoverPageModule } from '../../components/menupopover/menupopover.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { GuidePage } from './guide.page';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { MainPipe } from '../../pipes/main-pipe.module';
import { HtmlDescriptionComponentModule } from '../../components/html-description/html-description-component.module';
import { LanguageSelectorComponentModule } from '../../components/language-selector-component/language-selector-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Viewer3dModelComponentModule } from "../../components/viewer-3d-model-component/viewer-3d-model-component.module";
import { GuideStepContentComponentModule } from "../../components/guide-step-content-component/guide-step-content-component.module";
import { GuideinfoPageModule } from '../../components/guideinfo/guideinfo.module';
import { AssetviewComponentModule } from '../../components/assetview/assetview.module';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { SharedModule } from '../../app/shared/shared.module';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
// import { FileChooser } from '@ionic-native/file-chooser/ngx';
// import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
// import { FilePath } from '@ionic-native/file-path/ngx';

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
        // FileChooser,
        // IOSFilePicker,
        // FilePath
    ],
    providers: [
        File,
        PhotoViewer
    ]
})

export class GuidePageModule { }
