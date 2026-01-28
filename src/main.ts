import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes, withComponentInputBinding()),
        importProvidersFrom(HttpClientModule)
    ]
}).catch(err => console.error(err));
