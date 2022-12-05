import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonMenuWithSyncIndicatorComponent } from './ion-menu-with-sync-indicator/ion-menu-with-sync-indicator.component';
import { SyncSpinnerComponent } from './sync-spinner-component/sync-spinner-component';
import { IonicModule } from '@ionic/angular';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { SyncModalComponent } from './sync-modal-component/sync-modal-component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [IonMenuWithSyncIndicatorComponent,SyncSpinnerComponent, ProgressBarComponent, SyncModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild()
  ],
  exports: [IonMenuWithSyncIndicatorComponent, SyncSpinnerComponent, ProgressBarComponent, SyncModalComponent],
})
export class ComponentsModule { }
