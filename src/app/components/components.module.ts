import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonMenuWithSyncIndicatorComponent } from './ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.component';
import { SyncSpinnerComponent } from './sync-spinner-component/sync-spinner-component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [IonMenuWithSyncIndicatorComponent,SyncSpinnerComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [IonMenuWithSyncIndicatorComponent, SyncSpinnerComponent],
})
export class ComponentsModule { }
