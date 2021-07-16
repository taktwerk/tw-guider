import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taktwerk.guider',
  appName: 'Guider 2',
  bundledWebRuntime: false,
  // npmClient: 'npm',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: false,
      androidScaleType: 'CENTER_INSIDE',
      splashFullScreen: false,
      splashImmersive: false,
      backgroundColor: '#1C3461',
      androidSplashResourceName: 'splash'
    }
  },
  cordova: {},
  // linuxAndroidStudioPath: '/snap/android-studio/current/android-studio/bin/studio.sh',
};

export default config;
