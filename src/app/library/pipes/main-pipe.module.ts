import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeHtmlPipe} from './safe-html/safe-html';
import {DatePipe} from './date-pipe/date-pipe';

@NgModule({
    declarations: [
        SafeHtmlPipe,
        DatePipe
    ],
    imports: [CommonModule],
    exports: [
        SafeHtmlPipe,
        DatePipe
    ]
})

export class MainPipe {}
