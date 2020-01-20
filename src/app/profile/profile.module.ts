import { NgModule } from '@angular/core';
import { ProfilePage } from './profile';
import {SynchronizationComponentModule} from '../../components/synchronization-component/synchronization-component.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePage
      }
    ]),
    SynchronizationComponentModule
  ]
})
export class ProfilePageModule {}
