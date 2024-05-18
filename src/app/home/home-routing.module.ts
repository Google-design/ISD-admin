import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'home',
    loadChildren: () => import('./home.module').then( m => m.HomePageModule)
  },
  {
    path: 'prayer',
    loadChildren: () => import('../pages/prayer-times/prayer-times.module').then( m => m.PrayerTimesPageModule)
  },
  {
    path: 'events',
    loadChildren: () => import('../pages/events/events.module').then( m => m.EventsPageModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
