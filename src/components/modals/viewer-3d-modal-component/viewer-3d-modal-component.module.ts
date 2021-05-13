import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {Viewer3dModelComponentModule} from "../../viewer-3d-model-component/viewer-3d-model-component.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    Viewer3dModelComponentModule,
  ],
  exports: [],
})
export class Viewer3dModalComponentModule {}
