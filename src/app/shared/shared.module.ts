import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgloadDirective } from './bgload.directive';
import { ImgloadDirective } from './imgload.directive';
import { FilePickerDirective } from './file-picker.directive';

@NgModule({
  declarations: [BgloadDirective, ImgloadDirective, FilePickerDirective, FilePickerDirective],
  imports: [
    CommonModule
  ],
  exports: [BgloadDirective, ImgloadDirective, FilePickerDirective,]
})
export class SharedModule { }
