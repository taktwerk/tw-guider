import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgloadDirective } from './bgload.directive';
import { ImgloadDirective } from './imgload.directive';
import { FilePickerDirective } from './file-picker.directive';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [BgloadDirective, ImgloadDirective, FilePickerDirective, FilePickerDirective],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [BgloadDirective, ImgloadDirective, FilePickerDirective, TranslateModule]
})
export class SharedModule { }
