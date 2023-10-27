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
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  login!: FormGroup;
  isDark: boolean = false;

  constructor(
    public menu: MenuController,
    private auth: AuthService,
    private router: Router,
    private storage: StorageService,
    private theme: ThemeService
  ) {}

  async ngOnInit() {
    this.login = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    await this.theme
      .getTheme()
      .then((theme: any) => {
        this.isDark = theme['isDark'] == 'true' ? true : false;
      })
      .catch((err) => {
        console.log(err);
        this.isDark = false;
      });
    const prefersDark = window.matchMedia('dark');
    prefersDark.addEventListener('change', (mediaQuery) =>
      console.log(mediaQuery, 'media')
    );
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
