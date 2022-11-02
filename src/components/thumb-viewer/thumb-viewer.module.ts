import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbViewerComponent } from './thumb-viewer.component';
import { AssetviewComponent } from '../assetview/assetview.page';
import { AssetviewComponentModule } from '../assetview/assetview.module';

@NgModule({
  declarations: [ThumbViewerComponent],
  imports: [
    CommonModule,
    AssetviewComponentModule,
  ],
  exports: [ThumbViewerComponent]
})
export class ThumbViewerModule { }
