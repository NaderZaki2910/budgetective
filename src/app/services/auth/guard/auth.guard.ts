import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../token/auth.service';
import { Token } from 'src/app/models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.auth
        .getToken()
        .then((token: Token) => {
          // console.log(token);
          if (!!token && !!token.token && !!token.user) resolve(true);
          else {
            // console.log('User is not logged in');
            this.router.navigate(['/login']);
            resolve(false);
          }
        })
        .catch((err: Error) => {
          console.log(err);
          this.router.navigate(['/login']);
          resolve(false);
        });
    });
  }
}
