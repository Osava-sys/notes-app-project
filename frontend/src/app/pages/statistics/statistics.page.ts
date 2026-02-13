import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, Subject, from } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NgApexchartsModule } from 'ng-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { AppState } from '@app/store';
import { Grade } from '@core/models';
import * as GradesActions from '@app/store/grades/grades.actions';
import * as GradesSelectors from '@app/store/grades/grades.selectors';
import { PreferencesService } from '@core/services/preferences.service';
import { HapticsService } from '@core/services/haptics.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, IonicModule, NgApexchartsModule],
  template: `
    <ion-header class="ion-no-border stats-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Statistiques</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" class="stats-content">
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div *ngIf="(loading$ | async)" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement...</p>
      </div>

      <ng-container *ngIf="!(loading$ | async)">
        <div *ngIf="(statsData$ | async) as data" class="stats-container">
          <div class="kpi-row">
            <div class="kpi-card kpi-main animate-fade-in-up" (click)="router.navigate(['/tabs/home']); haptics.light()">
              <div class="kpi-icon" [style.background]="getScoreGradient(data.average)">
                <ion-icon name="trophy"></ion-icon>
              </div>
              <div class="kpi-value" [style.color]="getScoreColor(data.average)">{{ data.average | number:'1.1-1' }}</div>
              <div class="kpi-label">Moyenne générale</div>
            </div>
            <div class="kpi-card animate-fade-in-up stagger-2" (click)="haptics.light()">
              <div class="kpi-icon gradient-target"><ion-icon name="flag"></ion-icon></div>
              <div class="kpi-value">{{ data.target | number:'1.0-0' }}</div>
              <div class="kpi-label">Objectif</div>
            </div>
          </div>

          <div *ngIf="data.target > 0" class="progress-card animate-fade-in-up stagger-3">
            <div class="progress-header">
              <span>Progression vers l'objectif</span>
              <span class="progress-value">{{ getProgressPercent(data.average, data.target) }}%</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" [style.width.%]="Math.min(getProgressPercent(data.average, data.target), 100)"></div>
            </div>
          </div>

          <div *ngIf="data.semesterData.length > 0" class="chart-card animate-fade-in-up stagger-4">
            <h3>Moyennes par semestre</h3>
            <apx-chart
              [chart]="$any(chartOptions.chart)"
              [series]="$any(chartOptions.series)"
              [xaxis]="$any(chartOptions.xaxis)"
              [yaxis]="$any(chartOptions.yaxis)"
              [plotOptions]="$any(chartOptions.plotOptions)"
              [colors]="$any(chartOptions.colors)"
              [dataLabels]="$any(chartOptions.dataLabels)"
              [grid]="$any(chartOptions.grid)"
              [tooltip]="$any(chartOptions.tooltip)"
            ></apx-chart>
          </div>

          <div *ngIf="data.semesterData.length === 0" class="empty-state animate-fade-in">
            <div class="empty-icon">
              <ion-icon name="stats-chart-outline"></ion-icon>
            </div>
            <h2>Aucune donnée</h2>
            <p>Ajoutez des notes pour voir vos statistiques</p>
            <ion-button (click)="router.navigate(['/tabs/home'])">
              <ion-icon slot="start" name="add"></ion-icon>
              Ajouter une note
            </ion-button>
          </div>
        </div>
      </ng-container>
    </ion-content>
  `,
  styles: [`
    .stats-header ion-toolbar { --background: transparent; --border-width: 0; }
    ion-title { font-weight: 700; font-size: 20px; }
    .stats-content { --background: var(--stats-bg, #f0fdfa); }
    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; color: var(--ion-color-medium); }
    .loading-spinner { width: 48px; height: 48px; border: 3px solid var(--ion-color-light); border-top-color: var(--ion-color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .stats-container { padding: 16px; padding-bottom: 100px; }
    .kpi-row { display: flex; gap: 12px; margin-bottom: 16px; }
    .kpi-card { flex: 1; background: var(--kpi-card-bg, white); border-radius: 20px; padding: 20px; text-align: center; box-shadow: 0 4px 24px rgba(6, 182, 212, 0.12); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
    .kpi-card:active { transform: scale(0.97); }
    .kpi-main { flex: 1.2; }
    .kpi-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; color: white; }
    .kpi-icon.gradient-target { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
    .kpi-value { font-size: 28px; font-weight: 800; }
    .kpi-main .kpi-value { font-size: 36px; }
    .kpi-label { font-size: 12px; color: var(--ion-color-medium); margin-top: 4px; }
    .progress-card { background: var(--kpi-card-bg, white); border-radius: 20px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 24px rgba(6, 182, 212, 0.08); }
    .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; font-weight: 600; }
    .progress-value { color: var(--ion-color-primary); }
    .progress-bar-wrap { height: 10px; background: rgba(6, 182, 212, 0.15); border-radius: 10px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #06b6d4, #8b5cf6); border-radius: 10px; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .chart-card { background: var(--kpi-card-bg, white); border-radius: 20px; padding: 20px; box-shadow: 0 4px 24px rgba(6, 182, 212, 0.08); }
    .chart-card h3 { margin: 0 0 16px; font-size: 18px; font-weight: 700; }
    .empty-state { text-align: center; padding: 60px 24px; }
    .empty-icon { width: 100px; height: 100px; border-radius: 24px; background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15)); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 48px; color: var(--ion-color-primary); }
    .empty-state h2 { font-size: 22px; font-weight: 700; margin: 0 0 8px; }
    .empty-state p { margin: 0 0 24px; font-size: 15px; }
    .empty-state ion-button { --background: var(--gradient-primary); --border-radius: 14px; font-weight: 600; }
    body.dark .stats-content { --stats-bg: #0f172a; }
    body.dark .kpi-card, body.dark .progress-card, body.dark .chart-card { --kpi-card-bg: #1e293b; }
  `],
})
export class StatisticsPage implements OnInit, OnDestroy {
  grades$ = this.store.select(GradesSelectors.selectAllGrades);
  statistics$ = this.store.select(GradesSelectors.selectStatistics);
  loading$ = this.store.select(GradesSelectors.selectGradesLoading);

  private preferencesTarget$ = from(this.preferences.getTargetAverage());

  chartOptions: Partial<ApexOptions> = {
    series: [{ name: 'Moyenne', data: [] }],
    chart: { type: 'bar', height: 280, toolbar: { show: false }, animations: { enabled: true, speed: 800 } },
    plotOptions: { bar: { borderRadius: 10, columnWidth: '60%', distributed: true } },
    colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#22c55e', '#f97316', '#3b82f6'],
    dataLabels: { enabled: true, style: { fontSize: '12px' } },
    xaxis: { categories: [] },
    yaxis: { min: 0, max: 20, tickAmount: 4, labels: { style: { colors: ['#64748b'] } } },
    grid: { borderColor: 'rgba(6, 182, 212, 0.1)', strokeDashArray: 4, xaxis: { lines: { show: false } } },
    tooltip: { theme: 'light', y: { formatter: (v: number) => v.toFixed(1) + '/20' } },
  };

  statsData$: Observable<{
    average: number;
    target: number;
    semesterData: { semester: number; average: number }[];
  }> = combineLatest([this.grades$, this.statistics$, this.preferencesTarget$]).pipe(
    map(([grades, stats, target]) => {
      const semesterMap = new Map<number, { sum: number; count: number }>();
      (grades ?? []).forEach((g: Grade) => {
        const cur = semesterMap.get(g.semester) ?? { sum: 0, count: 0 };
        cur.sum += g.score;
        cur.count += 1;
        semesterMap.set(g.semester, cur);
      });
      const semesterAverages = (stats?.semesterAverages ?? []).length > 0
        ? stats!.semesterAverages
        : [...semesterMap.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([sem, { sum, count }]) => ({ semester: sem, average: sum / count, gradeCount: count }));
      const semesterData = semesterAverages.map((s) => ({ semester: s.semester, average: s.average }));
      const overallAvg = stats?.overallAverage ?? (grades?.length ? (grades.reduce((a, g) => a + g.score, 0) / grades.length) : 0);
      return { average: overallAvg, target, semesterData };
    })
  );

  Math = Math;
  private destroy$ = new Subject<void>();

  constructor(
    public store: Store<AppState>,
    public router: Router,
    public haptics: HapticsService,
    private preferences: PreferencesService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(GradesActions.loadGrades());
    this.store.dispatch(GradesActions.loadStatistics());
    this.statsData$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data.semesterData.length > 0) {
        this.chartOptions = {
          ...this.chartOptions,
          series: [{ name: 'Moyenne', data: data.semesterData.map((s) => +s.average.toFixed(2)) }],
          xaxis: { ...this.chartOptions.xaxis, categories: data.semesterData.map((s) => `S${s.semester}`) },
        };
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getScoreColor(score: number): string {
    if (score >= 16) return '#22c55e';
    if (score >= 12) return '#3b82f6';
    if (score >= 10) return '#f97316';
    return '#ec4899';
  }

  getScoreGradient(score: number): string {
    if (score >= 16) return 'linear-gradient(135deg, #22c55e, #06b6d4)';
    if (score >= 12) return 'linear-gradient(135deg, #3b82f6, #8b5cf6)';
    if (score >= 10) return 'linear-gradient(135deg, #f97316, #ec4899)';
    return 'linear-gradient(135deg, #ec4899, #8b5cf6)';
  }

  getProgressPercent(avg: number, target: number): number {
    if (target <= 0) return 0;
    return Math.round((avg / target) * 100);
  }

  async handleRefresh(event: any): Promise<void> {
    this.store.dispatch(GradesActions.loadGrades());
    this.store.dispatch(GradesActions.loadStatistics());
    setTimeout(() => event.target.complete(), 800);
  }
}
