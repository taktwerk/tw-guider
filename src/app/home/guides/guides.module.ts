import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuidesRoutingModule } from './guides-routing.module';
import { IonicModule } from '@ionic/angular';
import { GuidesComponent } from './guides.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GuidesComponent
  ],
  imports: [
    CommonModule,
    GuidesRoutingModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GuidesModule { }
