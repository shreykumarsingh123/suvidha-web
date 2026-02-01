import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
// import { authInterceptor } from './app/core/interceptors/auth.interceptor'; // I'll create this functional interceptor

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      // withInterceptors([authInterceptor]) 
    ),
    provideRouter(routes, withComponentInputBinding())
  ]
}).catch((err: any) => console.error(err));