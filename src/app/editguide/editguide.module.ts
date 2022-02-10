import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditguidePageRoutingModule } from './editguide-routing.module';

import { EditguidePage } from './editguide.page';
import { TranslateModule } from '@ngx-translate/core';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HtmlDescriptionComponentModule } from '../../components/html-description/html-description-component.module';
import { Viewer3dModelComponentModule } from '../../components/viewer-3d-model-component/viewer-3d-model-component.module';
import { ListviewComponentModule } from '../../components/listview/listview.module';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';
import { AssetviewComponentModule } from '../../components/assetview/assetview.module';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
// import { FileChooser } from '@ionic-native/file-chooser/ngx';
// import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
// import { FilePath } from '@ionic-native/file-path/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditguidePageRoutingModule,
    TranslateModule,
    SyncSpinnerComponentModule,
    ionMenuWithSyncIndicatorComponentModule,
    FontAwesomeModule,
    Viewer3dModelComponentModule,
    HtmlDescriptionComponentModule,
    AssetviewComponentModule,
    ListviewComponentModule,
    // FileChooser,
    // IOSFilePicker,
    // FilePath
  ],
  declarations: [EditguidePage],
  providers: [File, PhotoViewer]
})
export class EditguidePageModule { }
