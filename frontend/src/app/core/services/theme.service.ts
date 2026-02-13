import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

const THEME_KEY = 'app-theme';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>('light');
  public theme$: Observable<ThemeMode> = this.themeSubject.asObservable();

  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private async initTheme(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: THEME_KEY });
      const mode = (value as ThemeMode) || 'light';
      this.themeSubject.next(mode);
      await this.applyTheme(mode);
    } catch {
      this.applyTheme('light');
    }
  }

  async setTheme(mode: ThemeMode): Promise<void> {
    await Preferences.set({ key: THEME_KEY, value: mode });
    this.themeSubject.next(mode);
    await this.applyTheme(mode);
  }

  private async applyTheme(mode: ThemeMode): Promise<void> {
    const dark = mode === 'dark' || (mode === 'system' && this.isSystemDark());
    this.darkModeSubject.next(dark);
    document.body.classList.toggle('dark', dark);
  }

  private isSystemDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  toggleDark(): void {
    const next = this.darkModeSubject.value ? 'light' : 'dark';
    this.setTheme(next);
  }
}
