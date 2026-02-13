import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const TARGET_AVERAGE_KEY = 'target-average';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  async getTargetAverage(): Promise<number> {
    try {
      const { value } = await Preferences.get({ key: TARGET_AVERAGE_KEY });
      return value ? parseFloat(value) : 12;
    } catch {
      return 12;
    }
  }

  async setTargetAverage(value: number): Promise<void> {
    await Preferences.set({ key: TARGET_AVERAGE_KEY, value: String(value) });
  }
}
