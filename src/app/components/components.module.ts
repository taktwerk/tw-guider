import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonMenuWithSyncIndicatorComponent } from './ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.component';



@NgModule({
  declarations: [IonMenuWithSyncIndicatorComponent],
  imports: [
    CommonModule
  ],
  exports: [IonMenuWithSyncIndicatorComponent]
})
export class ComponentsModule { }
