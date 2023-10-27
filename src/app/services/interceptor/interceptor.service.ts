import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../auth/token/auth.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // YOU CAN ALSO DO THIS
    const token = this.auth.getToken();

    return from(token).pipe(
      switchMap((token) => {
        if (token) {
          request = request.clone({
            headers: request.headers.set(
              'Authorization',
              'Bearer ' + token.token
            ),
          });
        }

        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            headers: request.headers.set('Content-Type', 'application/json'),
          });
        }

        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do nothing for now
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            const status = error.status;
            const reason =
              error && error.error.reason ? error.error.reason : '';
            console.log(`Status ${status}: ${reason}`);
            return throwError(() => error);
          })
        );
      })
    );
  }
  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   const responseType = req.responseType || 'json';
  //   var apiToken: string;
  //   this.auth.getToken().then((result) => apiToken = result.token).catch((err) => console.log(err));
  //   const authed = req.clone({
  //     headers: req.headers
  //       .set('Authorization', 'Bearer ' + apiToken)
  //       .set('Content-Type', 'application/json'),
  //     responseType,
  //   });
  //   const notAuthed = req.clone({
  //     headers: req.headers.set('Content-Type', 'application/json'),
  //     responseType,
  //   });
  //   const authReq = apiToken ? authed : notAuthed;
  //   console.log(authReq);
  //   return next.handle(authReq);
  // }
}
