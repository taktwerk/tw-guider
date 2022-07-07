import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditguidePage } from './editguide.page';

const routes: Routes = [
  {
    path: '',
    component: EditguidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditguidePageRoutingModule {}


