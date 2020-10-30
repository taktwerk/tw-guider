import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditguidestepPageRoutingModule } from './editguidestep-routing.module';

import { EditguidestepPage } from './editguidestep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditguidestepPageRoutingModule
  ],
  declarations: [EditguidestepPage]
})
export class EditguidestepPageModule {}
