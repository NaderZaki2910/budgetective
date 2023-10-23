import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private readonly storage: Storage) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('here');
    const responseType = req.responseType || 'json';
    var apiToken: string = '';
    this.storage.get('access_token').then((value) => (apiToken = value));
    const authed = req.clone({
      headers: req.headers
        .set('Authorization', 'Bearer ' + apiToken)
        .set('Content-Type', 'application/json'),
      responseType,
    });
    const notAuthed = req.clone({
      headers: req.headers.set('Content-Type', 'application/json'),
      responseType,
    });
    const authReq = apiToken ? authed : notAuthed;
    console.log(authReq);
    return next.handle(authReq);
  }
}
