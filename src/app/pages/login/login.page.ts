import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/token/auth.service';
import { IonicModule } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Token, User } from '../../models/login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit, OnDestroy {
  login!: FormGroup;
  isDark: boolean = false;

  constructor(
    public menu: MenuController,
    private auth: AuthService,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.login = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDark = prefersDark.matches;

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener(
      'change',
      (mediaQuery) => (this.isDark = mediaQuery.matches)
    );

    this.auth.getToken().then((token: Token) => {
      if (!!token.token && !!token.user) this.router.navigate(['/dashboard']);
    });
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }

  async Login() {
    if (!this.login.invalid) {
      var login: User = {
        username: this.login.controls['username'].value,
        password: this.login.controls['password'].value,
      };
      await this.auth
        .useLogin(login)
        .then((val) => {
          console.log(val);
          if (val) {
            this.router.navigate(['/dashboard']);
          } else {
            alert('login fails');
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log('fill the fields');
    }
  }
}
