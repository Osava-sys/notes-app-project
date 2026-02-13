import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GradesState } from './grades.reducer';

export const selectGradesState = createFeatureSelector<GradesState>('grades');

export const selectAllGrades = createSelector(
  selectGradesState,
  (state: GradesState) => state.grades
);

export const selectGradesLoading = createSelector(
  selectGradesState,
  (state: GradesState) => state.loading
);

export const selectGradesError = createSelector(
  selectGradesState,
  (state: GradesState) => state.error
);

export const selectStatistics = createSelector(
  selectGradesState,
  (state: GradesState) => state.statistics
);

export const selectGradesBySemester = (semester: number) =>
  createSelector(selectAllGrades, (grades) =>
    grades.filter((grade) => grade.semester === semester)
  );

export const selectGradesCount = createSelector(
  selectAllGrades,
  (grades) => grades.length
);
