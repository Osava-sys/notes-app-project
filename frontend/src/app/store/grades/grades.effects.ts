import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import * as GradesActions from './grades.actions';

@Injectable()
export class GradesEffects {
  loadGrades$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GradesActions.loadGrades),
      switchMap(() =>
        this.apiService.getAllGrades().pipe(
          map(({ grades }) => GradesActions.loadGradesSuccess({ grades })),
          catchError((error) => of(GradesActions.loadGradesFailure({ error })))
        )
      )
    )
  );

  createGrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GradesActions.createGrade),
      switchMap(({ grade }) =>
        this.apiService.createGrade(grade).pipe(
          map(({ grade: newGrade }) => GradesActions.createGradeSuccess({ grade: newGrade })),
          catchError((error) => of(GradesActions.createGradeFailure({ error })))
        )
      )
    )
  );

  refreshStatsAfterMutate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        GradesActions.createGradeSuccess,
        GradesActions.updateGradeSuccess,
        GradesActions.deleteGradeSuccess
      ),
      map(() => GradesActions.loadStatistics())
    )
  );

  updateGrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GradesActions.updateGrade),
      switchMap(({ id, grade }) =>
        this.apiService.updateGrade(id, grade).pipe(
          map(({ grade: updatedGrade }) =>
            GradesActions.updateGradeSuccess({ grade: updatedGrade })
          ),
          catchError((error) => of(GradesActions.updateGradeFailure({ error })))
        )
      )
    )
  );

  deleteGrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GradesActions.deleteGrade),
      switchMap(({ id }) =>
        this.apiService.deleteGrade(id).pipe(
          map(() => GradesActions.deleteGradeSuccess({ id })),
          catchError((error) => of(GradesActions.deleteGradeFailure({ error })))
        )
      )
    )
  );

  loadStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GradesActions.loadStatistics),
      switchMap(() =>
        this.apiService.getStatistics().pipe(
          map((statistics) => GradesActions.loadStatisticsSuccess({ statistics })),
          catchError((error) => of(GradesActions.loadStatisticsFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService
  ) {}
}
