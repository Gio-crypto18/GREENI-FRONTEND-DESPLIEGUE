import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  if (typeof window === 'undefined') return null;

  const token = window.sessionStorage.getItem('token');
  return token && token.split('.').length === 3 ? token : null;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => {
          const token = sessionStorage.getItem('token');

          if (!token) return next(req);

          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });

          return next(cloned);
        }
      ])
    ),


    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ['localhost:8080', 'greeni-app-despliefuefinal.onrender.com'],
          disallowedRoutes: ['http://localhost:8080/login']
        }
      })
    )
  ]
};
