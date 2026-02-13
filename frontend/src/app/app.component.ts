import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {
  constructor(private theme: ThemeService) {
    this.initializeApp();
  }

  async initializeApp(): Promise<void> {
    try {
      const { Capacitor } = await import('@capacitor/core');
      if (Capacitor.isNativePlatform()) {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { SplashScreen } = await import('@capacitor/splash-screen');
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#4f46e5' });
        await SplashScreen.hide();
      }
    } catch (error) {
      // Ignore on web - plugins non disponibles
    }
  }
}
