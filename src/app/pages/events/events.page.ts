import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Firestore, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
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
  imageUrls: { [header: string]: string | null } = {}; // Store image URLs by notification header



  constructor(
    private readonly firestore: Firestore,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private storage: AngularFireStorage
  ) {
    this.notification$ = collectionData(collection(this.firestore, 'notifications'), { idField: 'id' }) as Observable<NotificationClass[]>;
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(){
    this.notification$.subscribe(async notificationsArray => {
      for (const nt of notificationsArray){
        const imageUrl = await this.getNotificationImageUrl(nt.imgpath);
        this.imageUrls[nt.header] = imageUrl; // Store the URL with the header as key
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
      this.presentToast('Error loading image', 'danger');
      return null;
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
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

  async deleteDocument(documentId: string | undefined) {
    if(documentId){
      const alert = await this.alertController.create({
        header: 'Confirm Delete',
        message: 'Are you sure you want to delete this event?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: async () => {
              const loading = this.loadingController.create();
              (await loading).present();
              try {
                const eventDocRef = doc(this.firestore, `notifications/${documentId}`);
                await deleteDoc(eventDocRef);
                this.presentToast('Event deleted successfully.', 'success');
              } catch (error) {
                console.error('Error deleting document:', error);
                this.presentToast('Error deleting event.', 'danger');
              }
              (await loading).dismiss();
            },
          },
        ],
      });
      await alert.present();
    }
  }

}
