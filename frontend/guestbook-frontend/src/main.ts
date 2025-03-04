import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {importProvidersFrom} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {AuthService} from './app/services/auth.service';
import {CommonModule} from '@angular/common';
import {ZXingScannerModule} from '@zxing/ngx-scanner';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(FormsModule, ReactiveFormsModule, ZXingScannerModule, CommonModule),
    provideAnimations(),
    AuthService
  ],
}).catch(err => console.error(err));
