import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController, AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, BehaviorSubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AppState } from '@app/store';
import { Grade } from '@core/models';
import { GradeFormModalComponent } from '@shared/components/grade-form-modal/grade-form-modal.component';
import { HapticsService } from '@core/services/haptics.service';
import * as GradesActions from '@app/store/grades/grades.actions';
import * as GradesSelectors from '@app/store/grades/grades.selectors';

type SortOption = 'course' | 'score-desc' | 'score-asc' | 'semester';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Tableau de bord</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="addGrade(); haptics.light()">
            <ion-icon slot="icon-only" name="add-circle"></ion-icon>
          </ion-button>
          <ion-button (click)="showSortOptions(); haptics.light()">
            <ion-icon slot="icon-only" name="filter"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <ion-toolbar class="search-toolbar">
        <ion-searchbar
          [(ngModel)]="searchText"
          (ionInput)="onSearchInput()"
          placeholder="Rechercher un cours..."
          [debounce]="200"
          mode="ios"
          class="custom-searchbar"
        ></ion-searchbar>
      </ion-toolbar>

      <ion-toolbar class="filter-toolbar">
        <ion-chip (click)="filterSemester = null; updateFilter(); haptics.selectionChanged()" [color]="!filterSemester ? 'primary' : 'medium'">
          Tous
        </ion-chip>
        <ion-chip *ngFor="let s of [1,2,3,4,5,6]" (click)="filterSemester = filterSemester === s ? null : s; updateFilter(); haptics.selectionChanged()"
          [color]="filterSemester === s ? 'primary' : 'medium'">
          S{{ s }}
        </ion-chip>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="home-content">
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div *ngIf="(loading$ | async)" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement...</p>
      </div>

      <ng-container *ngIf="!(loading$ | async)">
        <div *ngIf="(dashboardData$ | async) as data" class="dashboard-cards">
          <div class="stat-card stat-main animate-fade-in-up" (click)="router.navigate(['/tabs/statistics'])">
            <div class="stat-icon"><ion-icon name="trophy"></ion-icon></div>
            <div class="stat-value" [style.color]="getScoreColor(data.average)">{{ data.average | number:'1.1-1' }}</div>
            <div class="stat-label">Moyenne</div>
          </div>
          <div class="stat-card animate-fade-in-up stagger-2">
            <div class="stat-icon secondary"><ion-icon name="document-text"></ion-icon></div>
            <div class="stat-value">{{ data.total }}</div>
            <div class="stat-label">Notes</div>
          </div>
          <div class="stat-card animate-fade-in-up stagger-3">
            <div class="stat-icon success"><ion-icon name="school"></ion-icon></div>
            <div class="stat-value">{{ data.semesters }}</div>
            <div class="stat-label">Semestres</div>
          </div>
        </div>

        <div *ngIf="(filteredGrades$ | async)?.length === 0" class="empty-state animate-fade-in">
          <div class="empty-icon">
            <ion-icon name="search-outline"></ion-icon>
          </div>
          <h2>{{ searchText || filterSemester ? 'Aucun résultat' : 'Aucune note' }}</h2>
          <p>{{ searchText || filterSemester ? 'Modifiez votre recherche' : 'Ajoutez votre première note' }}</p>
          <ion-button *ngIf="!searchText && !filterSemester" (click)="addGrade()" class="add-first-btn">
            <ion-icon slot="start" name="add"></ion-icon>
            Ajouter
          </ion-button>
        </div>

        <div *ngIf="(filteredGrades$ | async) as grades" class="grades-list">
          <div
            *ngFor="let grade of grades; let i = index"
            class="grade-card"
            [class.animate-fade-in-up]="true"
            [style.animation-delay]="(i * 0.03) + 's'"
            (click)="editGrade(grade); haptics.light()"
          >
            <div class="grade-border" [style.background]="getScoreColor(grade.score)"></div>
            <div class="grade-content">
              <div class="grade-main">
                <h3>{{ grade.course }}</h3>
                <p>Semestre {{ grade.semester }}</p>
                <span class="grade-date" *ngIf="grade.createdAt">{{ formatDate(grade.createdAt) }}</span>
              </div>
              <div class="grade-score" [style.color]="getScoreColor(grade.score)">
                {{ grade.score | number:'1.1-1' }}/20
              </div>
              <ion-button fill="clear" size="small" (click)="confirmDelete(grade); $event.stopPropagation(); haptics.medium()" class="delete-btn">
                <ion-icon slot="icon-only" name="trash-outline" color="danger"></ion-icon>
              </ion-button>
            </div>
          </div>
        </div>
      </ng-container>
    </ion-content>

    <ion-fab slot="fixed" vertical="bottom" horizontal="end" (click)="addGrade(); haptics.medium()">
      <ion-fab-button class="fab-btn">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  `,
  styles: [`
    ion-toolbar {
      --background: var(--home-toolbar-bg, white);
      --border-width: 0;
    }
    ion-title { font-weight: 700; font-size: 20px; }
    .search-toolbar { --min-height: 56px; padding-top: 0; }
    .filter-toolbar { --min-height: 48px; padding: 8px 16px; gap: 8px; }
    .filter-toolbar ion-chip { cursor: pointer; }
    .home-content { --background: var(--home-bg, #f8fafc); }
    .loading-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 60px 24px; color: var(--ion-color-medium);
    }
    .loading-spinner {
      width: 48px; height: 48px;
      border: 3px solid var(--ion-color-light);
      border-top-color: var(--ion-color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .dashboard-cards {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 12px;
      padding: 16px;
    }
    .stat-card {
      background: var(--stat-card-bg, white);
      border-radius: 16px;
      padding: 16px;
      text-align: center;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform 0.2s;
    }
    .stat-card:active { transform: scale(0.98); }
    .stat-main { grid-column: 1; grid-row: 1 / 3; display: flex; flex-direction: column; justify-content: center; }
    .stat-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 12px; font-size: 20px;
    }
    .stat-icon.secondary { background: linear-gradient(135deg, #3b82f6, #6366f1); }
    .stat-icon.success { background: linear-gradient(135deg, #10b981, #34d399); }
    .stat-value { font-size: 28px; font-weight: 800; }
    .stat-main .stat-value { font-size: 42px; }
    .stat-label { font-size: 12px; color: var(--ion-color-medium); margin-top: 4px; }
    .empty-state { text-align: center; padding: 60px 24px; }
    .empty-icon {
      width: 100px; height: 100px; border-radius: 24px;
      background: var(--empty-icon-bg, linear-gradient(135deg, #eef2ff, #e0e7ff));
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px; font-size: 48px; color: var(--ion-color-primary);
    }
    .empty-state h2 { font-size: 22px; font-weight: 700; margin: 0 0 8px; }
    .empty-state p { margin: 0 0 24px; font-size: 15px; }
    .add-first-btn { --background: linear-gradient(135deg, #4f46e5, #7c3aed); --border-radius: 12px; font-weight: 600; }
    .grades-list { padding: 0 16px 100px; }
    .grade-card {
      background: var(--grade-card-bg, white);
      border-radius: 16px; margin-bottom: 12px; overflow: hidden; display: flex;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .grade-card:active { transform: scale(0.98); }
    .grade-border { width: 4px; flex-shrink: 0; }
    .grade-content { flex: 1; padding: 16px; display: flex; align-items: center; gap: 12px; }
    .grade-main { flex: 1; min-width: 0; }
    .grade-main h3 { font-size: 17px; font-weight: 600; margin: 0 0 4px; }
    .grade-main p { font-size: 13px; margin: 0; opacity: 0.8; }
    .grade-date { font-size: 11px; opacity: 0.6; margin-top: 4px; display: block; }
    .grade-score { font-size: 18px; font-weight: 700; }
    .delete-btn { margin: -8px; }
    .fab-btn { --background: linear-gradient(135deg, #4f46e5, #7c3aed); --box-shadow: 0 4px 20px rgba(79,70,229,0.4); }
    .dark .home-content { --home-bg: #0f172a; }
    .dark .stat-card { --stat-card-bg: #1e293b; }
    .dark .grade-card { --grade-card-bg: #1e293b; }
  `],
})
export class HomePage implements OnInit, OnDestroy {
  grades$ = this.store.select(GradesSelectors.selectAllGrades);
  loading$ = this.store.select(GradesSelectors.selectGradesLoading);
  statistics$ = this.store.select(GradesSelectors.selectStatistics);

  searchText = '';
  filterSemester: number | null = null;
  currentSort: SortOption = 'course';
  private search$ = new BehaviorSubject('');
  private filter$ = new BehaviorSubject<number | null>(null);
  private sort$ = new BehaviorSubject<SortOption>('course');

  dashboardData$: Observable<{ average: number; total: number; semesters: number }> = combineLatest([
    this.grades$,
    this.statistics$,
  ]).pipe(
    map(([grades, stats]) => ({
      average: stats?.overallAverage ?? 0,
      total: grades?.length ?? 0,
      semesters: new Set(grades?.map(g => g.semester) ?? []).size,
    }))
  );

  filteredGrades$: Observable<Grade[]> = combineLatest([
    this.grades$,
    this.search$,
    this.filter$,
    this.sort$,
  ]).pipe(
    map(([grades, search, filter, sort]) => this.applyFiltersInternal(grades ?? [], search, filter, sort))
  );

  private destroy$ = new Subject<void>();

  constructor(
    public store: Store<AppState>,
    public router: Router,
    public haptics: HapticsService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(GradesActions.loadGrades());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  onSearchInput(): void {
    this.search$.next(this.searchText);
  }

  private applyFiltersInternal(grades: Grade[], search: string, filter: number | null, sort: SortOption): Grade[] {
    let result = [...grades];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(g => g.course.toLowerCase().includes(q));
    }
    if (filter !== null) {
      result = result.filter(g => g.semester === filter);
    }
    result.sort((a, b) => {
      switch (sort) {
        case 'score-desc': return b.score - a.score;
        case 'score-asc': return a.score - b.score;
        case 'semester': return a.semester - b.semester || a.course.localeCompare(b.course);
        default: return a.course.localeCompare(b.course);
      }
    });
    return result;
  }

  updateFilter(): void {
    this.filter$.next(this.filterSemester);
  }

  async showSortOptions(): Promise<void> {
    const sheet = await this.actionSheetController.create({
      header: 'Trier par',
      buttons: [
        { text: 'Nom du cours', handler: () => { this.currentSort = 'course'; this.sort$.next('course'); } },
        { text: 'Note (décroissant)', handler: () => { this.currentSort = 'score-desc'; this.sort$.next('score-desc'); } },
        { text: 'Note (croissant)', handler: () => { this.currentSort = 'score-asc'; this.sort$.next('score-asc'); } },
        { text: 'Semestre', handler: () => { this.currentSort = 'semester'; this.sort$.next('semester'); } },
        { text: 'Annuler', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  formatDate(d: Date | string | undefined): string {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  async handleRefresh(event: any): Promise<void> {
    this.store.dispatch(GradesActions.loadGrades());
    setTimeout(() => event.target.complete(), 800);
  }

  async addGrade(): Promise<void> {
    const modal = await this.modalController.create({
      component: GradeFormModalComponent,
      componentProps: {},
      cssClass: 'grade-modal',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'submit' && data) {
      this.store.dispatch(GradesActions.createGrade({ grade: data }));
      this.haptics.success();
      const toast = await this.toastController.create({ message: 'Note ajoutée !', duration: 2000, color: 'success', position: 'top' });
      await toast.present();
    }
  }

  async editGrade(grade: Grade): Promise<void> {
    const modal = await this.modalController.create({
      component: GradeFormModalComponent,
      componentProps: { grade },
      cssClass: 'grade-modal',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'submit' && data) {
      this.store.dispatch(GradesActions.updateGrade({ id: grade.id, grade: data }));
      this.haptics.success();
      const toast = await this.toastController.create({ message: 'Note mise à jour !', duration: 2000, color: 'success', position: 'top' });
      await toast.present();
    }
  }

  async confirmDelete(grade: Grade): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Supprimer',
      message: `Supprimer la note de ${grade.course} ?`,
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: () => {
            this.store.dispatch(GradesActions.deleteGrade({ id: grade.id }));
            this.haptics.medium();
            this.toastController.create({ message: 'Note supprimée', duration: 2000, color: 'success', position: 'top' }).then(t => t.present());
          },
        },
      ],
    });
    await alert.present();
  }

  getScoreColor(score: number): string {
    if (score >= 16) return '#10b981';
    if (score >= 12) return '#3b82f6';
    if (score >= 10) return '#f59e0b';
    return '#ef4444';
  }
}
