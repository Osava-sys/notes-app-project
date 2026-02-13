import { createReducer, on } from '@ngrx/store';
import { Grade, Statistics } from '@core/models';
import * as GradesActions from './grades.actions';

export interface GradesState {
  grades: Grade[];
  statistics: Statistics | null;
  loading: boolean;
  error: any;
}

export const initialState: GradesState = {
  grades: [],
  statistics: null,
  loading: false,
  error: null,
};

export const gradesReducer = createReducer(
  initialState,
  
  // Load Grades
  on(GradesActions.loadGrades, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GradesActions.loadGradesSuccess, (state, { grades }) => ({
    ...state,
    grades,
    loading: false,
  })),
  on(GradesActions.loadGradesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Create Grade
  on(GradesActions.createGrade, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GradesActions.createGradeSuccess, (state, { grade }) => ({
    ...state,
    grades: [...state.grades, grade],
    loading: false,
  })),
  on(GradesActions.createGradeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Update Grade
  on(GradesActions.updateGrade, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GradesActions.updateGradeSuccess, (state, { grade }) => ({
    ...state,
    grades: state.grades.map((g) => (g.id === grade.id ? grade : g)),
    loading: false,
  })),
  on(GradesActions.updateGradeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Delete Grade
  on(GradesActions.deleteGrade, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GradesActions.deleteGradeSuccess, (state, { id }) => ({
    ...state,
    grades: state.grades.filter((g) => g.id !== id),
    loading: false,
  })),
  on(GradesActions.deleteGradeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Load Statistics
  on(GradesActions.loadStatistics, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(GradesActions.loadStatisticsSuccess, (state, { statistics }) => ({
    ...state,
    statistics,
    loading: false,
  })),
  on(GradesActions.loadStatisticsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
