import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {GuideStepContentComponent} from "./guide-step-content-component";
import {TranslateModule} from "@ngx-translate/core";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {Viewer3dModelComponentModule} from "../viewer-3d-model-component/viewer-3d-model-component.module";
import {HtmlDescriptionComponentModule} from "../html-description/html-description-component.module";

@NgModule({
  declarations: [
    GuideStepContentComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FontAwesomeModule,
    HtmlDescriptionComponentModule,
    Viewer3dModelComponentModule
  ],
  exports: [
    GuideStepContentComponent
  ],
})
export class GuideStepContentComponentModule {}
