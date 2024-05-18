import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable  } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NotificationClass } from 'src/app/classes/notification-class';
import { AddEventPage } from '../add-event/add-event.page';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  notification$: Observable<NotificationClass[]>
  imageTitle: string;
  loadURL$: Promise<string | null>;



  constructor(
    private readonly firestore: Firestore,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    private storage: AngularFireStorage
  ) {
    this.notification$ = collectionData(collection(this.firestore, 'notifications')) as Observable<NotificationClass[]>;
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(){
    this.notification$.subscribe(async notificationsArray => {
      for (const nt of notificationsArray){
        this.loadURL$ = this.getNotificationImageUrl(nt.imgpath);
        this.imageTitle = nt.header;
      }
    });
  }

  async getNotificationImageUrl(imagePath: string): Promise<string | null> {
    if (!imagePath || imagePath.length === 0) {
      return null; // Return null for notifications without an image path
    }

    const storageRef = this.storage.ref(imagePath); // Construct the storage reference    
    try{
      const downloadURL = await storageRef.getDownloadURL().toPromise();
      return downloadURL;
    } catch (error) {
      console.error('Error getting image download URL:', error);
      this.presentToast('Error loading image');
      return null;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async logout() {
    await this.modalController.dismiss();
    await this.authService.logout();
    this.router.navigateByUrl('/', {replaceUrl: true});
    this.modalController.dismiss();
  }

  close() {
    this.modalController.dismiss();
  }

  async openEventAdd() {
    const modal = await this.modalController.create({
      component: AddEventPage
    });
    modal.present();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadEvents();
      event.target.complete();
    }, 1000);
  }

}
