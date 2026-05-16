import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Storage } from './storage';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  private readonly storageKey = 'app-theme';
  private platformId = inject(PLATFORM_ID);
  private storage = inject(Storage);

  getTheme(): AppTheme {
    return this.storage.get<AppTheme>(this.storageKey, 'dark') ?? 'dark';
  }

  setTheme(theme: AppTheme): void {
    this.storage.set(this.storageKey, theme);

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  initTheme(): void {
    this.setTheme(this.getTheme());
  }

  toggleTheme(): AppTheme {
    const nextTheme: AppTheme = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
    return nextTheme;
  }
}
