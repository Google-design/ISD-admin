import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrayerTimesPageRoutingModule } from './prayer-times-routing.module';

import { PrayerTimesPage } from './prayer-times.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrayerTimesPageRoutingModule
  ],
  declarations: [PrayerTimesPage]
})
export class PrayerTimesPageModule {}
