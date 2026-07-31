import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nakhlah.app',
  appName: 'nakhlah',
  webDir: 'out',
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
