import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { ThemeService } from '@core/services/theme.service';
import { HapticsService } from '@core/services/haptics.service';
import { User } from '@core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Profil</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="theme.toggleDark(); haptics.light()">
            <ion-icon [name]="(theme.darkMode$ | async) ? 'sunny' : 'moon'"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="profile-content">
      <div *ngIf="currentUser$ | async as user" class="profile-container">
        <div class="profile-card animate-fade-in-up">
          <div class="avatar" [style.background]="getAvatarGradient(user)">
            {{ getInitials(user) }}
          </div>
          <h2>{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="email">{{ user.email }}</p>
        </div>

        <div class="menu-section animate-fade-in-up stagger-2">
          <ion-item button detail="false" lines="full">
            <ion-icon name="person-outline" slot="start"></ion-icon>
            <ion-label>Modifier le profil</ion-label>
          </ion-item>
          <ion-item button detail="false" lines="full">
            <ion-icon name="shield-checkmark-outline" slot="start"></ion-icon>
            <ion-label>Confidentialité</ion-label>
          </ion-item>
          <ion-item button detail="false" lines="full">
            <ion-icon name="help-circle-outline" slot="start"></ion-icon>
            <ion-label>Aide & Support</ion-label>
          </ion-item>
          <ion-item button detail="false" lines="full">
            <ion-icon name="information-circle-outline" slot="start"></ion-icon>
            <ion-label>À propos</ion-label>
          </ion-item>
        </div>

        <ion-button expand="block" fill="outline" color="danger" class="logout-btn animate-fade-in-up" (click)="confirmLogout()">
          <ion-icon name="log-out-outline" slot="start"></ion-icon>
          Se déconnecter
        </ion-button>

        <div class="app-version animate-fade-in-up">
          <p>Notes App v1.0.0</p>
          <p>© 2025 - GSN</p>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-toolbar {
      --background: white;
      --border-width: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    ion-title { font-weight: 700; font-size: 20px; color: #1e1b4b; }

    .profile-content { --background: #f8fafc; }

    .profile-container {
      padding: 24px 16px;
      padding-bottom: 100px;
    }

    .profile-card {
      background: white;
      border-radius: 24px;
      padding: 40px 24px;
      text-align: center;
      margin-bottom: 24px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }

    .avatar {
      width: 96px;
      height: 96px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0 auto 20px;
    }

    .profile-card h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1e1b4b;
      margin: 0 0 8px;
    }

    .email {
      color: #64748b;
      font-size: 15px;
      margin: 0;
    }

    .menu-section {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .menu-section ion-item {
      --padding-start: 20px;
      --inner-padding-end: 20px;
    }

    .menu-section ion-icon {
      margin-right: 16px;
      color: #64748b;
      font-size: 22px;
    }

    .logout-btn {
      --border-radius: 12px;
      height: 50px;
      font-weight: 600;
      margin-bottom: 32px;
    }

    .app-version {
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
    }

    .app-version p { margin: 4px 0; }
  `],
})
export class ProfilePage implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    public theme: ThemeService,
    public haptics: HapticsService,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  getInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getAvatarGradient(user: User): string {
    const colors = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b'];
    const idx = user.firstName.charCodeAt(0) % colors.length;
    return `linear-gradient(135deg, ${colors[idx]}, ${colors[(idx + 1) % colors.length]})`;
  }

  async confirmLogout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Se déconnecter',
          role: 'destructive',
          handler: async () => {
            await this.authService.logout();
          },
        },
      ],
    });
    await alert.present();
  }
}
