import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(), provideToastr({
    timeOut: 3000,
    positionClass: 'toast-top-right',
    enableHtml: true
  }), 
  provideZoneChangeDetection({ eventCoalescing: true }), 
  provideRouter(routes), 
  provideHttpClient()]
};
