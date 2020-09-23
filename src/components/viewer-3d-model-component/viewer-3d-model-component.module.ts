import { NgModule } from '@angular/core';
import {Viewer3dModelComponent} from './viewer-3d-model-component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    Viewer3dModelComponent,
  ],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
    ],
  exports: [
    Viewer3dModelComponent
  ]
})
export class Viewer3dModelComponentModule {}
