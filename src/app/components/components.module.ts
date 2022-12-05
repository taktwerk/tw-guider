import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonMenuWithSyncIndicatorComponent } from './ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.component';
import { SyncSpinnerComponent } from './sync-spinner-component/sync-spinner-component';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';



@NgModule({
  declarations: [IonMenuWithSyncIndicatorComponent,SyncSpinnerComponent, ProgressBarComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [IonMenuWithSyncIndicatorComponent, SyncSpinnerComponent, ProgressBarComponent],
})
export class ComponentsModule { }
