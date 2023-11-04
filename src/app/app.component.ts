import { routes } from './app.routes';
import { CanActivate, Router } from '@angular/router';
import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  OnInit,
} from '@angular/core';
import { ToggleChangeEventDetail } from '@ionic/core/components';
import { StorageService } from './services/storage/storage.service';
import { AuthService } from 'src/app/services/auth/token/auth.service';
import { Token } from './models/login.model';
import { MenuController } from '@ionic/angular';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isDark: boolean = false;
  pageLoaded: boolean = false;

  username: string = '';
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
    {
      title: 'Categories',
      url: '/categories',
      icon: 'layers',
    },
  ];
  public labels = [];
  constructor(
    private router: Router,
    private storage: StorageService,
    private theme: ThemeService,
    private auth: AuthService,
    private menu: MenuController
  ) {}
  async ngOnInit() {
    // console.log(window);

    await this.theme
      .getTheme()
      .then((theme: any) => {
        this.isDark = theme['isDark'] == 'true' ? true : false;
      })
      .catch((err) => {
        console.log(err);
        this.isDark = false;
      });
    // Initialize the dark theme based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkTheme(this.isDark);
  }

  // Check/uncheck the toggle and update the theme based on isDark
  initializeDarkTheme(isDark: boolean) {
    this.toggleDarkTheme(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark theme
  async toggleChange(event: Event) {
    const ev = event as CustomEvent<ToggleChangeEventDetail<boolean>>;
    await this.theme.setTheme(ev.detail.checked);
    this.toggleDarkTheme(ev.detail.checked);
  }

  // Add or remove the "dark" class on the document body
  toggleDarkTheme(shouldAdd: boolean) {
    this.isDark = shouldAdd;
    document.body.classList.toggle('dark', shouldAdd);
  }

  logout() {
    this.auth.deleteToken();
    this.menu.close();
    this.router.navigate(['/login']);
  }

  routeChanged($event: Event) {
    this.auth
      .getToken()
      .then((token: Token) => {
        if (!!token && !!token.token && !!token.user) {
          this.username = token.user;
          this.pageLoaded = true;
        } else {
          // console.log('User is not logged in');
          this.pageLoaded = false;
        }
      })
      .catch((err: Error) => {
        this.pageLoaded = false;
        console.log(err);
      });
    // console.log('opened');
  }
}
