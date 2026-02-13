import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { ApiService } from './api.service';
import { User, LoginRequest, RegisterRequest } from '@core/models';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.authLoadedPromise = this.loadStoredUser();
  }

  private authLoaded = false;
  private authLoadedPromise: Promise<void> | null = null;

  private async loadStoredUser(): Promise<void> {
    try {
      const [{ value: token }, { value: userJson }] = await Promise.all([
        Preferences.get({ key: TOKEN_KEY }),
        Preferences.get({ key: USER_KEY }),
      ]);
      if (token) {
        localStorage.setItem('token', token);
      }
      if (userJson) {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      this.authLoaded = true;
    }
  }

  async ensureAuthLoaded(): Promise<void> {
    if (this.authLoaded) return;
    if (!this.authLoadedPromise) {
      this.authLoadedPromise = this.loadStoredUser();
    }
    await this.authLoadedPromise;
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.apiService.login(credentials).pipe(
      switchMap((response) =>
        from(
          this.storeAuthData(response.token, response.user).then(() => {
            this.currentUserSubject.next(response.user);
            return response;
          })
        )
      )
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.apiService.register(data).pipe(
      switchMap((response) =>
        from(
          this.storeAuthData(response.token, response.user).then(() => {
            this.currentUserSubject.next(response.user);
            return response;
          })
        )
      )
    );
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: USER_KEY });
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private async storeAuthData(token: string, user: User): Promise<void> {
    await Preferences.set({ key: TOKEN_KEY, value: token });
    await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
    localStorage.setItem('token', token);
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
