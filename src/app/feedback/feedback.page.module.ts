import { AssetviewComponentModule } from '../../components/assetview/assetview.module';
import { CommonModule } from '@angular/common';
import { FeedbackPage } from './feedback.page';
import { File } from '@ionic-native/file/ngx';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LanguageSelectorComponentModule } from '../../components/language-selector-component/language-selector-component.module';
import { MainPipe } from '../../pipes/main-pipe.module';
import { NgModule } from '@angular/core';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../app/shared/shared.module';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';

@NgModule({
  declarations: [
    FeedbackPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: FeedbackPage }]),
    SyncSpinnerComponentModule,
    ionMenuWithSyncIndicatorComponentModule,

    LanguageSelectorComponentModule,
    TranslateModule,
    MainPipe,
    AssetviewComponentModule,
    SharedModule
    // FileChooser,
    // IOSFilePicker,
    // FilePath
  ],
  exports: [
  ],
  providers: [File, PhotoViewer]
})
export class FeedbackPageModule { }
