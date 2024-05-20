import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PrayerTimesPage } from '../pages/prayer-times/prayer-times.page';
import { EventsPage } from '../pages/events/events.page';
import { StorageEditPage } from '../pages/storage-edit/storage-edit.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) { }

  async openPrayerTimes() {    
    const modal = await this.modalController.create({
      component: PrayerTimesPage,
    });
    modal.present();
  }
  
  async openEvents() {
    const modal = await this.modalController.create({
      component: EventsPage
    });
    modal.present();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', {replaceUrl: true});
    this.modalController.dismiss();
  }

  async openStorageEdit() {
    const modal = await this.modalController.create({
      component: StorageEditPage
    });
    modal.present();
  }

}
