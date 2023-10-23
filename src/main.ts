import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);

// import { Component, enableProdMode, importProvidersFrom } from '@angular/core';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { RouteReuseStrategy, provideRouter } from '@angular/router';
// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// import { routes } from './app/app.routes';
// import { AppComponent } from './app/app.component';
// import { environment } from './environments/environment';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Storage } from '@ionic/storage';
// import {
//   HTTP_INTERCEPTORS,
//   HttpClient,
//   HttpHeaders,
//   HttpParams,
// } from '@angular/common/http';
// import { InterceptorService } from './app/services/interceptor/interceptor.service';

// if (environment.production) {
//   enableProdMode();
// }

// bootstrapApplication(AppComponent, {
//   providers: [
//     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: InterceptorService,
//       multi: true,
//     },
//     importProvidersFrom(IonicModule.forRoot({})),
//     provideRouter(routes),
//     Storage,
//     HttpClient,
//     HttpHeaders,
//     HttpParams,
//   ],
// });
