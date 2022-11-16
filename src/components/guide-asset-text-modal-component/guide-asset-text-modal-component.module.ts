import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GuideAssetTextModalComponent } from './guide-asset-text-modal-component';
import { HtmlDescriptionComponentModule } from 'components/html-description/html-description-component.module';

@NgModule({
  declarations: [
    GuideAssetTextModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    HtmlDescriptionComponentModule
  ],
  exports: [],
})
export class GuideAssetTextModalComponentModule { }
