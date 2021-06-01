import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GuideListComponent } from "./guide-list-component";
import { TranslateModule } from "@ngx-translate/core";
import { GuideinfoPageModule } from '../guideinfo/guideinfo.module';

@NgModule({
  declarations: [
    GuideListComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    GuideinfoPageModule,
  ],
  exports: [
    GuideListComponent
  ],
})
export class GuideListComponentModule { }
