import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { LogoutPage } from './logout.page';
import { RouterModule } from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    LogoutPage,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LogoutPage
      }
    ])
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    LogoutPage
  ]
})
export class LogoutPageModule {}
