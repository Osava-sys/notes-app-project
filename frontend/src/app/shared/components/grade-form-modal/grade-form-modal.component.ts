import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Grade } from '@core/models';

@Component({
  selector: 'app-grade-form-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancel()">Annuler</ion-button>
        </ion-buttons>
        <ion-title>{{ isEditMode ? 'Modifier la note' : 'Nouvelle note' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onSubmit()" [disabled]="form.invalid || loading" strong>
            <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
            <span *ngIf="!loading">{{ isEditMode ? 'Enregistrer' : 'Ajouter' }}</span>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 pt-4">
        <div class="form-group animate-fade-in-up">
          <label class="block text-sm font-semibold text-slate-700 mb-2">Matière / Cours</label>
          <ion-item lines="none" class="rounded-xl border border-slate-200 bg-white">
            <ion-input
              formControlName="course"
              placeholder="Ex: Mathématiques, Physique..."
              type="text"
            ></ion-input>
          </ion-item>
          <p *ngIf="form.get('course')?.invalid && form.get('course')?.touched" class="text-red-500 text-sm mt-1">
            Le nom du cours est requis
          </p>
        </div>

        <div class="form-group animate-fade-in-up stagger-2">
          <label class="block text-sm font-semibold text-slate-700 mb-2">Note (sur 20)</label>
          <ion-item lines="none" class="rounded-xl border border-slate-200 bg-white">
            <ion-input
              formControlName="score"
              placeholder="0 - 20"
              type="number"
              min="0"
              max="20"
              step="0.25"
            ></ion-input>
          </ion-item>
          <p *ngIf="form.get('score')?.invalid && form.get('score')?.touched" class="text-red-500 text-sm mt-1">
            Note invalide (0 à 20)
          </p>
        </div>

        <div class="form-group animate-fade-in-up stagger-3">
          <label class="block text-sm font-semibold text-slate-700 mb-2">Semestre</label>
          <ion-item lines="none" class="rounded-xl border border-slate-200 bg-white">
            <ion-select
              formControlName="semester"
              placeholder="Sélectionner"
              interface="action-sheet"
            >
              <ion-select-option *ngFor="let s of semesters" [value]="s">Semestre {{ s }}</ion-select-option>
            </ion-select>
          </ion-item>
        </div>
      </form>
    </ion-content>
  `,
  styles: [`
    ion-item {
      --background: transparent;
      --inner-padding-end: 12px;
    }
    ion-select {
      width: 100%;
      max-width: 100%;
    }
  `],
})
export class GradeFormModalComponent implements OnInit {
  @Input() grade?: Grade;

  form!: FormGroup;
  isEditMode = false;
  loading = false;
  semesters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.grade;
    this.form = this.fb.group({
      course: [this.grade?.course || '', [Validators.required, Validators.minLength(2)]],
      score: [
        this.grade?.score ?? null,
        [Validators.required, Validators.min(0), Validators.max(20)],
      ],
      semester: [this.grade?.semester ?? 1, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  cancel(): void {
    this.modalController.dismiss(null, 'cancel');
  }

  onSubmit(): void {
    if (this.form.valid && !this.loading) {
      const value = this.form.value;
      const score = typeof value.score === 'string' ? parseFloat(value.score) : value.score;
      this.modalController.dismiss(
        {
          ...value,
          score,
          semester: Number(value.semester),
        },
        'submit'
      );
    }
  }
}
