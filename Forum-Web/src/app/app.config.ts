import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { CredentailsService } from '../../credentials.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  MessageService, 
  BrowserAnimationsModule, 
  CommonModule, 
  BrowserModule, 
  provideAnimations(),
  CredentailsService
  ]
};
