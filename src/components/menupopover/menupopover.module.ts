import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuPopoverComponent } from './menupopover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [MenuPopoverComponent],
  entryComponents: [MenuPopoverComponent]
})
export class MenupopoverPageModule {}
