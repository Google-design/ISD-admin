import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';

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
    private storage: AngularFireStorage,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      header: ['', Validators.required],
      description: ['', Validators.required],
      imgpath: [''], // Optional fields
      date: [''],
      time: [''],
      link: [''],
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

  async sureUpload(fileInput: HTMLInputElement) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: `Do you want to upload the image?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.onFileSelected(fileInput);
          },
        },
      ],
    });
    await alert.present();
  }

  async onFileSelected(fileInput: HTMLInputElement) {
    const loading = await this.loadingController.create();
    loading.present();

    const file: File | null = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      const filePath = `${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Monitor upload progress
      task.percentageChanges().subscribe((percentage: any) => {
        console.log(`Upload is ${percentage}% done`);
        if(percentage == 100) {this.showMessage("File Uploaded Successfully","success");}
      });

      task.snapshotChanges().pipe(
        finalize(() => {
          // Update form value with the image URL
          console.log("File name from firebase: " + file.name);
          this.eventForm.patchValue({ imgpath: file.name });
        })
      ).subscribe();
    } else {
      this.showMessage('No file selected. Please select a file to upload.', 'danger');
    }
    loading.dismiss();
  }

  async showMessage(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

}
