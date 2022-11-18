import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {Viewer3dModelComponentModule} from "../../viewer-3d-model-component/viewer-3d-model-component.module";
import { Viewer3dModalComponent } from './viewer-3d-modal-component';

@NgModule({
  declarations: [Viewer3dModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    Viewer3dModelComponentModule,
  ],
  exports: [],
})
export class Viewer3dModalComponentModule {}
