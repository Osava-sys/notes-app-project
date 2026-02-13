import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/login" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Inscription</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="register-content">
      <div class="register-container">
        <div class="register-card animate-fade-in-up">
          <div class="header-section">
            <div class="icon-wrap">
              <ion-icon name="person-add"></ion-icon>
            </div>
            <h1>Créer un compte</h1>
            <p>Rejoignez Notes App en quelques secondes</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="input-row">
              <div class="input-group half">
                <ion-item lines="none" class="input-item">
                  <ion-input formControlName="firstName" placeholder="Prénom"></ion-input>
                </ion-item>
                <p *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched" class="error-text">
                  Requis
                </p>
              </div>
              <div class="input-group half">
                <ion-item lines="none" class="input-item">
                  <ion-input formControlName="lastName" placeholder="Nom"></ion-input>
                </ion-item>
                <p *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched" class="error-text">
                  Requis
                </p>
              </div>
            </div>

            <div class="input-group">
              <ion-item lines="none" class="input-item">
                <ion-icon name="mail-outline" slot="start"></ion-icon>
                <ion-input formControlName="email" type="email" placeholder="Email"></ion-input>
              </ion-item>
              <p *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error-text">
                Email invalide
              </p>
            </div>

            <div class="input-group">
              <ion-item lines="none" class="input-item">
                <ion-icon name="lock-closed-outline" slot="start"></ion-icon>
                <ion-input formControlName="password" type="password" placeholder="Mot de passe (min. 6 caractères)"></ion-input>
              </ion-item>
              <p *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error-text">
                Min. 6 caractères
              </p>
            </div>

            <ion-button
              expand="block"
              type="submit"
              [disabled]="registerForm.invalid || loading"
              class="submit-btn"
            >
              <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
              <span *ngIf="!loading">S'inscrire</span>
            </ion-button>
          </form>

          <div class="login-link">
            <p>Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    ion-toolbar {
      --background: transparent;
      --color: white;
    }

    ion-back-button {
      --color: white;
    }

    .register-content {
      --background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%);
    }

    .register-container {
      min-height: 100%;
      padding: 24px;
      padding-top: 100px;
    }

    .register-card {
      background: rgba(255, 255, 255, 0.98);
      border-radius: 24px;
      padding: 32px 24px;
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .header-section {
      text-align: center;
      margin-bottom: 28px;
    }

    .icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 28px;
      color: white;
    }

    .header-section h1 {
      font-size: 24px;
      font-weight: 800;
      color: #1e1b4b;
      margin: 0;
    }

    .header-section p {
      color: #64748b;
      margin-top: 6px;
      font-size: 14px;
    }

    .input-row {
      display: flex;
      gap: 12px;
    }

    .input-group {
      margin-bottom: 12px;
    }

    .input-group.half {
      flex: 1;
    }

    .input-item {
      --background: #f8fafc;
      border-radius: 12px;
      --padding-start: 16px;
    }

    .input-item ion-icon {
      color: #64748b;
      margin-right: 12px;
    }

    .error-text {
      color: #ef4444;
      font-size: 12px;
      margin: 4px 0 0 12px;
    }

    .submit-btn {
      --background: linear-gradient(135deg, #4f46e5, #7c3aed);
      --border-radius: 12px;
      height: 50px;
      font-weight: 600;
      margin-top: 24px;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
    }

    .login-link p {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }

    .login-link a {
      color: #4f46e5;
      font-weight: 600;
      text-decoration: none;
    }
  `],
})
export class RegisterPage {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      this.loading = true;

      this.authService.register(this.registerForm.value).subscribe({
        next: async () => {
          this.loading = false;
          const toast = await this.toastController.create({
            message: 'Compte créé avec succès !',
            duration: 2000,
            color: 'success',
            position: 'top',
          });
          await toast.present();
          await this.router.navigate(['/tabs/home']);
        },
        error: async (error) => {
          this.loading = false;
          const msg = error.error?.error || error.error?.message || "Erreur d'inscription";
          const toast = await this.toastController.create({
            message: msg,
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
