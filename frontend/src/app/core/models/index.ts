export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
}

export interface Grade {
  id: string;
  score: number;
  course: string;
  semester: number;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Statistics {
  overallAverage: number;
  semesterAverages: SemesterAverage[];
  totalGrades: number;
}

export interface SemesterAverage {
  semester: number;
  average: number;
  gradeCount: number;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateGradeRequest {
  score: number;
  course: string;
  semester: number;
}

export interface UpdateGradeRequest {
  score?: number;
  course?: string;
  semester?: number;
}
