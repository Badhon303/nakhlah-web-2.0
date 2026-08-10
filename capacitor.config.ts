import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fintechhub.nakhlah',
  appName: 'nakhlah',
  webDir: 'out',
  plugins: {
    CapacitorHttp: {
      enabled: true
    },
    // Android 15+ enforces edge-to-edge with no opt-out on Android 16, so the
    // WebView always draws behind the status and navigation bars. "css" makes
    // Capacitor inject --safe-area-inset-* custom properties that the app uses
    // to pad content out from under them.
    SystemBars: {
      insetsHandling: 'css',
      style: 'LIGHT'
    }
  }
};

export default config;
