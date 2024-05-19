import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Iqama, IqamaClass } from 'src/app/classes/iqama-class';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-prayer-times',
  templateUrl: './prayer-times.page.html',
  styleUrls: ['./prayer-times.page.scss'],
})
export class PrayerTimesPage implements OnInit {
  iqama$ : Observable<Iqama[]>;
  IqamaTimes: IqamaClass = new IqamaClass;
  isEditing: boolean = false;
  iqamaDocId: string | undefined = "iqamas";  // To store document ID for updating


  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly firestore: Firestore,
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.iqama$ = collectionData(collection(this.firestore, 'iqama_time'), { idField: 'id' }) as Observable<Iqama[]>;
    this.loadTimings();
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

  ngOnInit() {
  }

  // loadTimings() {
  //   this.iqama$.subscribe(iqamaArray => {
  //     if (iqamaArray.length > 0) {
  //       const iq = iqamaArray[0];
  //       this.iqamaDocId = iq.id;  // Capture document ID
  //       this.IqamaTimes.fajr = iq.fajr;
  //       this.IqamaTimes.duhr = iq.duhr;
  //       this.IqamaTimes.asr = iq.asr;
  //       this.IqamaTimes.maghrib = iq.maghrib;
  //       this.IqamaTimes.isha = iq.isha;
  //       this.IqamaTimes.jummah = iq.jummah;
  //       this.IqamaTimes.jummahUNT = iq.jummahUNT;
  //     }
  //   });
  // }
  loadTimings() {
    const iqamaDocRef = doc(this.firestore, `iqama_time/${this.iqamaDocId}`);
    docData(iqamaDocRef).subscribe(iq => {
      if (iq) {
        this.IqamaTimes.fajr = iq['fajr'];
        this.IqamaTimes.duhr = iq['duhr'];
        this.IqamaTimes.asr = iq['asr'];
        this.IqamaTimes.maghrib = iq['maghrib'];
        this.IqamaTimes.isha = iq['isha'];
        this.IqamaTimes.jummah = iq['jummah'];
        this.IqamaTimes.jummahUNT = iq['jummahUNT'];
      }
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadTimings();
      event.target.complete();
    }, 1000);
  }

  editTimings() {
    this.isEditing = true;
  }
  cancelEditing() {
    this.isEditing = false;
  }

  async sureSave(){
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Do you want to save the changes?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.cancelEditing();
            this.loadTimings();
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.saveTimings();
          },
        },
      ],
    });
    await alert.present();
  }

  async saveTimings() {
    const loading = await this.loadingController.create();
    await loading.present();

    if (this.iqamaDocId) {
      const iqamaDocRef = doc(this.firestore, `iqama_time/${this.iqamaDocId}`);
      await updateDoc(iqamaDocRef, {
        fajr: this.IqamaTimes.fajr,
        duhr: this.IqamaTimes.duhr,
        asr: this.IqamaTimes.asr,
        maghrib: this.IqamaTimes.maghrib,
        isha: this.IqamaTimes.isha,
        jummah: this.IqamaTimes.jummah,
        jummahUNT: this.IqamaTimes.jummahUNT,
      });
      this.isEditing = false;
    } else {
      console.error("Document ID is undefined. Cannot update document.");
    }

    await loading.dismiss();
  }


}
