import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrayerTimesPage } from './prayer-times.page';

const routes: Routes = [
  {
    path: '',
    component: PrayerTimesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrayerTimesPageRoutingModule {}
