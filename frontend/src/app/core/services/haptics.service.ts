import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HapticsService {
  async light(): Promise<void> {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {}
  }

  async medium(): Promise<void> {
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {}
  }

  async success(): Promise<void> {
    try {
      const { Haptics, NotificationType } = await import('@capacitor/haptics');
      await Haptics.notification({ type: NotificationType.Success });
    } catch {}
  }

  async selectionChanged(): Promise<void> {
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionChanged();
    } catch {}
  }
}
