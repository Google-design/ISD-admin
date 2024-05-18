import { Component, OnInit } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  eventForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private firestore: Firestore,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      header: ['', Validators.required],
      description: ['', Validators.required],
      imgpath: [''], // Optional field
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  get formControls() {
    return this.eventForm.controls;
  }

  close() {
    this.modalController.dismiss();
  }

  async sureAdd() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Do you want to save the changes?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.addEvent();
          },
        },
      ],
    });
    await alert.present();
  }

  async addEvent() {
    if (this.eventForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    const eventData = this.eventForm.value;
    
    const notificationsCollection = collection(this.firestore, 'notifications');
    const eventDocRef = doc(notificationsCollection, eventData.title);

    setDoc(eventDocRef, eventData)
    .then(() => {
      console.log('Event successfully added!');
      this.modalController.dismiss();
    })
    .catch((error: any) => {
      console.error('Error adding event: ', error);
    });

    await loading.dismiss();
  }

}
