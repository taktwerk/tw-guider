import { NgModule } from '@angular/core';
import {HtmlDescriptionComponent} from './html-description-component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {MainPipe} from '../../pipes/main-pipe.module';

@NgModule({
  declarations: [
    HtmlDescriptionComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    MainPipe,
  ],
  exports: [
    HtmlDescriptionComponent
  ]
})
export class HtmlDescriptionComponentModule {}
