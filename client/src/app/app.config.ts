import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations} from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { provideToastr } from '@openng/ngx-toastr';
import { errorInterceptor } from './_interceptor/error.interceptor';
import { authInterceptor } from './_interceptor/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: 
  [
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptors([errorInterceptor, authInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right'
    }), provideAnimationsAsync()
  ]
};
