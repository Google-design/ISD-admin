import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorageEditPage } from './storage-edit.page';

const routes: Routes = [
  {
    path: '',
    component: StorageEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageEditPageRoutingModule {}
