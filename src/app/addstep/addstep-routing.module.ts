import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddstepPage } from './addstep.page';

const routes: Routes = [
  {
    path: '',
    component: AddstepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddstepPageRoutingModule {}
