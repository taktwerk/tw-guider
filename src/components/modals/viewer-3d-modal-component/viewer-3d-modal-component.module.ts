import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {Viewer3dModalComponent} from './viewer-3d-modal-component';
import {Viewer3dModelComponentModule} from "../../viewer-3d-model-component/viewer-3d-model-component.module";

@NgModule({
  declarations: [
    Viewer3dModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    Viewer3dModelComponentModule,
  ],
  exports: [
    Viewer3dModalComponent
  ],
})
export class Viewer3dModalComponentModule {}
