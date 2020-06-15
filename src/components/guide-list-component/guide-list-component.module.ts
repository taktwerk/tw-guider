import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {GuideListComponent} from "./guide-list-component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    GuideListComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
  ],
  exports: [
    GuideListComponent
  ],
})
export class GuideListComponentModule {}
