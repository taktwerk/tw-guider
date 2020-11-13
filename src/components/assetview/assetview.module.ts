import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssetviewComponent } from './assetview.page';
import { HtmlDescriptionComponentModule } from '../html-description/html-description-component.module';
import { Viewer3dModelComponentModule } from '../viewer-3d-model-component/viewer-3d-model-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Viewer3dModelComponentModule
  ],
  exports: [
    AssetviewComponent
  ],
  declarations: [AssetviewComponent]
})
export class AssetviewComponentModule { }
