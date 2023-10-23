import { CanActivate } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToggleChangeEventDetail } from '@ionic/core/components';
import { StorageService } from './services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  themeToggle = false;
  isDark: boolean = false;
  public appPages = [
    {
      title: 'DashBoard',
      url: '/dashboard',
      icon: 'stats-chart',
    },
    {
      title: 'Wallets',
      url: '/wallets',
      icon: 'wallet',
    },
  ];
  public labels = [];
  constructor(private storage: StorageService) {}

  async ngOnInit() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDark = prefersDark.matches;
    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkTheme(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) =>
      this.toggleDarkTheme(mediaQuery.matches)
    );
  }

  // Check/uncheck the toggle and update the theme based on isDark
  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  toggleChange(event: Event) {
    const ev = event as CustomEvent<ToggleChangeEventDetail<boolean>>;
    this.toggleDarkTheme(ev.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: boolean) {
    this.isDark = shouldAdd;
    document.body.classList.toggle('dark', shouldAdd);
  }
}
