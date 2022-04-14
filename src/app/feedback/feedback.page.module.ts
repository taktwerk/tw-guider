import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FeedbackPage } from './feedback.page';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { LanguageSelectorComponentModule } from '../../components/language-selector-component/language-selector-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { MainPipe } from '../../pipes/main-pipe.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
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
    VirtualScrollerModule,
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
