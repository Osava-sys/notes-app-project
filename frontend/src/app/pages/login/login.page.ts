import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  template: `
    <ion-content [fullscreen]="true" class="login-content">
      <div class="login-container">
        <div class="login-card animate-fade-in-up">
          <div class="logo-section">
            <div class="logo-icon animate-scale-in"><ion-icon name="school"></ion-icon></div>
            <h1 class="app-title">Notes App</h1>
            <p class="app-subtitle">Gérez vos notes en toute simplicité</p>
          </div>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <div class="input-group">
              <ion-input type="email" fill="outline" label="Email" labelPlacement="stacked" placeholder="Adresse email" formControlName="email" class="custom-input"></ion-input>
              <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error-text">Email invalide</p>
            </div>
            <div class="input-group">
              <ion-input type="password" fill="outline" label="Mot de passe" labelPlacement="stacked" placeholder="Mot de passe" formControlName="password" class="custom-input"></ion-input>
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-text">Mot de passe requis</p>
            </div>
            <ion-button expand="block" type="submit" [disabled]="loginForm.invalid || loading" class="submit-btn">
              <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
              <span *ngIf="!loading">Se connecter</span>
            </ion-button>
          </form>
          <div class="register-link">
            <p>Pas encore de compte ? <a routerLink="/register">S'inscrire</a></p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-content { --background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%); }
    .login-container { min-height: 100%; display: flex; align-items: center; justify-content: center; padding: 24px; padding-top: 60px; }
    .login-card { background: rgba(255,255,255,0.98); border-radius: 24px; padding: 40px 28px; max-width: 400px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .logo-section { text-align: center; margin-bottom: 32px; }
    .logo-icon { width: 80px; height: 80px; border-radius: 20px; background: linear-gradient(135deg,#4f46e5,#7c3aed); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px; color: white; }
    .app-title { font-size: 28px; font-weight: 800; color: #1e1b4b; margin: 0; }
    .app-subtitle { color: #64748b; margin-top: 8px; font-size: 15px; }
    .input-group { margin-bottom: 16px; }
    .custom-input { --background: #f8fafc; --border-radius: 14px; --padding-start: 16px; --padding-end: 16px; --padding-top: 16px; --padding-bottom: 16px; }
    .error-text { color: #ef4444; font-size: 13px; margin: 4px 0 0 12px; }
    .submit-btn { --background: linear-gradient(135deg,#4f46e5,#7c3aed); --border-radius: 14px; height: 52px; font-weight: 600; margin-top: 24px; }
    .register-link { text-align: center; }
    .register-link p { color: #64748b; font-size: 15px; margin: 0; }
    .register-link a { color: #4f46e5; font-weight: 600; text-decoration: none; }
  `],
})
export class LoginPage {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: async () => {
          this.loading = false;
          const toast = await this.toastController.create({ message: 'Connexion réussie !', duration: 2000, color: 'success', position: 'top' });
          await toast.present();
          await this.router.navigate(['/tabs/home']);
        },
        error: async (error) => {
          this.loading = false;
          const toast = await this.toastController.create({
            message: error.error?.error || 'Erreur de connexion',
            duration: 3000,
            color: 'danger',
            position: 'top',
          });
          await toast.present();
        },
      });
    }
  }
}
