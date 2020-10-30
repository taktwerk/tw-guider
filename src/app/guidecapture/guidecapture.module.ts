import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GuidecapturePageRoutingModule } from './guidecapture-routing.module';

import { GuidecapturePage } from './guidecapture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GuidecapturePageRoutingModule
  ],
  declarations: [GuidecapturePage]
})
export class GuidecapturePageModule {}
