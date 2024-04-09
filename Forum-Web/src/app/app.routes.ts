import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';

export const routes: Routes = [
    { path:'login', component: LoginPageComponent}, 
    { path: '', component: HomePageComponent},
    { path: 'feedback', component: FeedbackPageComponent},
];
