import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgloadDirective } from './bgload.directive';
import { ImgloadDirective } from './imgload.directive';

@NgModule({
  declarations: [BgloadDirective, ImgloadDirective],
  imports: [
    CommonModule
  ],
  exports: [BgloadDirective, ImgloadDirective]
})
export class SharedModule { }
