import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { HomePage } from 'src/app/home/home.page';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) { }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if(user){
      // this.router.navigateByUrl('/home', { replaceUrl: true });
      this.openHomePage();
    } else {
      this.showAlert('Login failed', 'Please try again!');
    }
  }

  async openHomePage() {
    const modal = await this.modalController.create({
      component: HomePage
    });
    modal.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  forgotPassword() {
    const email = this.credentials.value.email;
    if(email){
      this.authService.sendPasswordResetEmail(email)
        .then(() => {
          this.showAlert('Password Reset', 'A password reset email has been sent to your email address.');
        })
        .catch((error: any) => {
          this.showAlert('Error', 'Failed to send password reset email. Please try again later.');
          console.error('Error sending password reset email:', error);
        });
    } else {
      this.showAlert("Error", "Please provide the email");
    }
  }
}
