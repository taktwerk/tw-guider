import { AssetviewComponentModule } from '../../components/assetview/assetview.module';
import { CommonModule } from '@angular/common';
import { EditguidePage } from './editguide.page';
import { EditguidePageRoutingModule } from './editguide-routing.module';
import { File } from '@ionic-native/file/ngx';
import { FormsModule } from '@angular/forms';
import { HtmlDescriptionComponentModule } from '../../components/html-description/html-description-component.module';
import { IonicModule } from '@ionic/angular';
import { ListviewComponentModule } from '../../components/listview/listview.module';
import { NgModule } from '@angular/core';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { SyncSpinnerComponentModule } from '../../components/sync-spinner-component/sync-spinner-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { Viewer3dModelComponentModule } from '../../components/viewer-3d-model-component/viewer-3d-model-component.module';
import { ionMenuWithSyncIndicatorComponentModule } from '../../components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditguidePageRoutingModule,
    TranslateModule,
    SyncSpinnerComponentModule,
    ionMenuWithSyncIndicatorComponentModule,
    Viewer3dModelComponentModule,
    HtmlDescriptionComponentModule,
    AssetviewComponentModule,
    ListviewComponentModule,
  ],
  declarations: [EditguidePage],
  providers: [File, PhotoViewer]
})
export class EditguidePageModule { }
