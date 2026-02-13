import { createAction, props } from '@ngrx/store';
import { Grade, CreateGradeRequest, UpdateGradeRequest, Statistics } from '@core/models';

// Load Grades
export const loadGrades = createAction('[Grades] Load Grades');
export const loadGradesSuccess = createAction(
  '[Grades] Load Grades Success',
  props<{ grades: Grade[] }>()
);
export const loadGradesFailure = createAction(
  '[Grades] Load Grades Failure',
  props<{ error: any }>()
);

// Create Grade
export const createGrade = createAction(
  '[Grades] Create Grade',
  props<{ grade: CreateGradeRequest }>()
);
export const createGradeSuccess = createAction(
  '[Grades] Create Grade Success',
  props<{ grade: Grade }>()
);
export const createGradeFailure = createAction(
  '[Grades] Create Grade Failure',
  props<{ error: any }>()
);

// Update Grade
export const updateGrade = createAction(
  '[Grades] Update Grade',
  props<{ id: string; grade: UpdateGradeRequest }>()
);
export const updateGradeSuccess = createAction(
  '[Grades] Update Grade Success',
  props<{ grade: Grade }>()
);
export const updateGradeFailure = createAction(
  '[Grades] Update Grade Failure',
  props<{ error: any }>()
);

// Delete Grade
export const deleteGrade = createAction(
  '[Grades] Delete Grade',
  props<{ id: string }>()
);
export const deleteGradeSuccess = createAction(
  '[Grades] Delete Grade Success',
  props<{ id: string }>()
);
export const deleteGradeFailure = createAction(
  '[Grades] Delete Grade Failure',
  props<{ error: any }>()
);

// Load Statistics
export const loadStatistics = createAction('[Grades] Load Statistics');
export const loadStatisticsSuccess = createAction(
  '[Grades] Load Statistics Success',
  props<{ statistics: Statistics }>()
);
export const loadStatisticsFailure = createAction(
  '[Grades] Load Statistics Failure',
  props<{ error: any }>()
);
