import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Grade,
  CreateGradeRequest,
  UpdateGradeRequest,
  Statistics,
} from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Auth endpoints
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data);
  }

  // Grades endpoints
  getAllGrades(): Observable<{ grades: Grade[]; count: number }> {
    return this.http.get<{ grades: Grade[]; count: number }>(
      `${this.apiUrl}/grades`,
      { headers: this.getHeaders() }
    );
  }

  getGradeById(id: string): Observable<{ grade: Grade }> {
    return this.http.get<{ grade: Grade }>(`${this.apiUrl}/grades/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createGrade(data: CreateGradeRequest): Observable<{ message: string; grade: Grade }> {
    return this.http.post<{ message: string; grade: Grade }>(
      `${this.apiUrl}/grades`,
      data,
      { headers: this.getHeaders() }
    );
  }

  updateGrade(
    id: string,
    data: UpdateGradeRequest
  ): Observable<{ message: string; grade: Grade }> {
    return this.http.put<{ message: string; grade: Grade }>(
      `${this.apiUrl}/grades/${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  deleteGrade(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/grades/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}/grades/statistics`, {
      headers: this.getHeaders(),
    });
  }
}
