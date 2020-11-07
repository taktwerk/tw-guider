import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditguidePageRoutingModule } from './editguide-routing.module';

import { EditguidePage } from './editguide.page';
import { TranslateModule } from '@ngx-translate/core';
import { SyncSpinnerComponentModule } from 'src/components/sync-spinner-component/sync-spinner-component.module';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HtmlDescriptionComponentModule } from 'src/components/html-description/html-description-component.module';
import { Viewer3dModelComponentModule } from 'src/components/viewer-3d-model-component/viewer-3d-model-component.module';
import { ListviewComponentModule } from 'src/components/listview/listview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditguidePageRoutingModule,
    TranslateModule,
    SyncSpinnerComponentModule,
    FontAwesomeModule,
    Viewer3dModelComponentModule,
    HtmlDescriptionComponentModule,
    ListviewComponentModule
  ],
  declarations: [EditguidePage]
})
export class EditguidePageModule { }
