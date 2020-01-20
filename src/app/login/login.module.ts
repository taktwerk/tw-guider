import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginPage } from './login.page';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginPage
      }
    ])
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class LoginPageModule {}
