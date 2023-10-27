import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private readonly storage: StorageService) {}

  async setTheme(isDark: boolean) {
    await this.storage.set('theme', { isDark: isDark ? 'true' : 'false' });
  }

  async getTheme(): Promise<string> {
    return this.storage.get('theme');
  }
}
