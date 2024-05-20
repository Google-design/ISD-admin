import { Component, ViewChild } from '@angular/core';
import { App } from '@capacitor/app';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) outlet: any;

  constructor(private platform: Platform) {
    this.appRun();
    this.hideSplash();

    // Back and exit with hardware back button
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if(!this.outlet?.canGoBack()){
        App.exitApp();
      }
  });
  }

  async appRun() {
    await SplashScreen.hide();

    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }

  async hideSplash() {
    await SplashScreen.hide();
  }

}
