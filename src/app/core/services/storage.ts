import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  private platformId = inject(PLATFORM_ID);

  private get browserStorage(): globalThis.Storage | null {
    return isPlatformBrowser(this.platformId) ? globalThis.localStorage : null;
  }

  get<T>(key: string, fallback: T | null = null): T | null {
    const storage = this.browserStorage;
    if (!storage) return fallback;

    const raw = storage.getItem(key);
    if (raw === null) return fallback;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as T;
    }
  }

  set(key: string, value: unknown): void {
    const storage = this.browserStorage;
    if (!storage) return;

    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    storage.setItem(key, serialized);
  }

  remove(key: string): void {
    this.browserStorage?.removeItem(key);
  }

  clear(): void {
    this.browserStorage?.clear();
  }
}
