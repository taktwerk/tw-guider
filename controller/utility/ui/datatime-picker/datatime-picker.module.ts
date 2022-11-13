import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatatimePickerComponent } from './datatime-picker.component';
import { DatatimePickerService } from './datatime-picker.service';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    DatatimePickerComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [DatatimePickerService]
})
export class DatatimePickerModule { }
