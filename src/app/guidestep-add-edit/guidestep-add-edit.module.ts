import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuidestepAddEditPageRoutingModule } from './guidestep-add-edit-routing.module';

import { GuidestepAddEditPage } from './guidestep-add-edit.page';

import { TranslateModule } from '@ngx-translate/core';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HtmlDescriptionComponentModule } from 'src/components/html-description/html-description-component.module';
import { Viewer3dModelComponentModule } from 'src/components/viewer-3d-model-component/viewer-3d-model-component.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AssetviewComponentModule } from 'src/components/assetview/assetview.module';
import { ionMenuWithSyncIndicatorComponentModule } from 'src/components/ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuidestepAddEditPageRoutingModule,
    TranslateModule,
    SyncSpinnerComponentModule,
    ionMenuWithSyncIndicatorComponentModule,

    FontAwesomeModule,
    Viewer3dModelComponentModule,
    HtmlDescriptionComponentModule,
    AssetviewComponentModule,
    CKEditorModule,
  ],
  declarations: [GuidestepAddEditPage]
})
export class GuidestepAddEditPageModule { }
