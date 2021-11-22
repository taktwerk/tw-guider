import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssetviewComponent } from './assetview.page';
import { Viewer3dModelComponentModule } from '../viewer-3d-model-component/viewer-3d-model-component.module';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Viewer3dModelComponentModule,
    FontAwesomeModule,
    SharedModule
  ],
  exports: [
    AssetviewComponent
  ],
  declarations: [AssetviewComponent]
})
export class AssetviewComponentModule { }
