import { AssetviewComponentModule } from '../../components/assetview/assetview.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListViewComponent } from './listview.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { HtmlDescriptionComponentModule } from '../html-description/html-description-component.module';
import { SyncSpinnerComponentModule } from '../sync-spinner-component/sync-spinner-component.module';
import { Viewer3dModelComponentModule } from '../viewer-3d-model-component/viewer-3d-model-component.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SyncSpinnerComponentModule,
    FontAwesomeModule,
    Viewer3dModelComponentModule,
    HtmlDescriptionComponentModule,
    AssetviewComponentModule,
    SharedModule
  ],
  exports: [
    ListViewComponent
  ],
  declarations: [ListViewComponent]
})
export class ListviewComponentModule { }
