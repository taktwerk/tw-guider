import { AccessControlDirective } from './access-control.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgloadDirective } from './bgload.directive';
import { DivDirective } from './div.directive';
import { Array2StringPipe } from './array2string.pipe';
import { InputDirective } from './input.directive';
import { StringManipulatePipe } from './string-manipulate.pipe';
import { DateTimeStampPipe } from './date-time-stamp.pipe';

const directives = [BgloadDirective, DivDirective, Array2StringPipe, InputDirective, StringManipulatePipe, 
  DateTimeStampPipe, AccessControlDirective]
@NgModule({
  declarations: directives,
  imports: [
    CommonModule
  ],
  exports: directives
})
export class DirectiveModule { }
