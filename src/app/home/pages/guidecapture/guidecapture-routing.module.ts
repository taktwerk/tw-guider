import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuidecapturePage } from './guidecapture.page';

const routes: Routes = [
  {
    path: '',
    component: GuidecapturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuidecapturePageRoutingModule {}
