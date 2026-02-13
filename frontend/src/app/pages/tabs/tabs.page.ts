import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonicModule, RouterModule],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" class="custom-tab-bar">
        <ion-tab-button tab="home">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="statistics">
          <ion-icon name="stats-chart-outline"></ion-icon>
          <ion-label>Stats</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Profil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    .custom-tab-bar {
      --background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      padding-bottom: env(safe-area-inset-bottom, 0);
      padding-top: 8px;
      min-height: 56px;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
    }
    ion-tab-button {
      --color: #94a3b8;
      --color-selected: #4f46e5;
    }
    ion-tab-button ion-icon { font-size: 24px; }
    ion-tab-button ion-label { font-size: 11px; font-weight: 600; }
  `],
})
export class TabsPage {}
