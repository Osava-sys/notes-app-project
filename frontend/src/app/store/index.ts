import { ActionReducerMap } from '@ngrx/store';
import { gradesReducer, GradesState } from './grades/grades.reducer';

export interface AppState {
  grades: GradesState;
}

export const reducers: ActionReducerMap<AppState> = {
  grades: gradesReducer,
};
