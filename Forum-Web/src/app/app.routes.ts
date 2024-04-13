import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { RecoveryPageComponent } from './recovery-page/recovery-page.component';

export const routes: Routes = [
    { path:'login', component: LoginPageComponent}, 
    { path: '', component: HomePageComponent},
    { path: 'feedback', component: FeedbackPageComponent},
    { path: 'about', component: AboutPageComponent},
    { path: 'recovery', component: RecoveryPageComponent },
];
