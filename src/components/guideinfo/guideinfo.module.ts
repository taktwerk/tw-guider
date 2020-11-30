import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GuideinfoPage } from './guideinfo.page';
import { HtmlDescriptionComponentModule } from '../html-description/html-description-component.module';
import { TranslateModule } from '@ngx-translate/core';
import { AssetviewComponentModule } from '../assetview/assetview.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HtmlDescriptionComponentModule,
    TranslateModule,
    AssetviewComponentModule
  ],
  declarations: [GuideinfoPage],
  entryComponents: [GuideinfoPage]
})
export class GuideinfoPageModule { }
