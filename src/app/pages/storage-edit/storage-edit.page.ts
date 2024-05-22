import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-storage-edit',
  templateUrl: './storage-edit.page.html',
  styleUrls: ['./storage-edit.page.scss'],
})
export class StorageEditPage implements OnInit {
  files: any[] = [];

  constructor(
    private modalController: ModalController,
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.loadFiles();
  }

  async loadFiles() {
    try {
      const ref = this.storage.ref('');
      const result = await ref.listAll().toPromise();
      if (result && result.items) {
        this.files = result.items;
      } else {
        console.warn('No files found or result is undefined');
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }

  async sureDelete(file: any) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this file?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => this.deleteFile(file) // Pass the reference to deleteFile without invoking it
        }
      ]
    });
    await alert.present();
  }
  


  async deleteFile(file: any) {
    const loading = await this.loadingController.create();
    loading.present();
    try {
      await this.storage.ref(file.fullPath).delete().toPromise();
      this.loadFiles();  // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting file:', error);
    }
    loading.dismiss();
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
        if(percentage == 100) {
          this.showMessage("File Uploaded Successfully","success");
          this.loadFiles();
        }
      });
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
      color: color,
      buttons: [
        {
          text: 'X',
          role: 'cancel',
        }
      ]
    });
    await toast.present();
  }

}
