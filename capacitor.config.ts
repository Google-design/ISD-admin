import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Denton Admin',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#98f5ff",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
