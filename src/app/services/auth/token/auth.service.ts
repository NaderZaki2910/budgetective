import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  from,
  of,
  throwError,
  interval,
  firstValueFrom,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from '../../storage/storage.service';
import { Token, User } from '../../../models/login.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userInfo = new BehaviorSubject(null);
  jwtHelper = new JwtHelperService();
  constructor(
    private readonly storage: StorageService,
    private http: HttpClient
  ) {}

  async useLogin(login: User): Promise<boolean> {
    var result;
    if (login) {
      var token = await firstValueFrom(
        this.http.post<Token>(`${environment.api}/user/login`, {
          username: login.username,
          password: login.password,
        })
      );
      if (!!token.token && !!token.user) {
        console.log(token);
        await this.storage.set('access_token', token);
        result = true;
      } else {
        result = false;
      }
    } else {
      result = false;
    }
    return result;
  }

  async getToken(): Promise<Token> {
    return await this.storage.get('access_token');
  }

  async deleteToken() {
    return this.storage.remove('access_token');
  }
}
