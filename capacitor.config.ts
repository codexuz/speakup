import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uz.speakup.edumo',
  appName: 'Speak Up',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  },
  plugins:{
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '562146186124-sm1g78mcu2q6u58j2tvfnapd1lu3jg85.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    }
  }
};

export default config;
