import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uz.speakup.edumo',
  appName: 'Speak Up',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  },
  plugins:{
    EdgeToEdge: {
      backgroundColor: "#f7f7f7",
    },
  }
};

export default config;
