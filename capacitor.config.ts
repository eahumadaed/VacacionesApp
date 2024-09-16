import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.vacaciones.app',
  appName: 'VacacionesApp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchAutoHide: true, 
      androidScaleType: 'CENTER_CROP',  
      showSpinner: false,  
      backgroundColor: '#ffffffff', 
    }
  }
};

export default config;
