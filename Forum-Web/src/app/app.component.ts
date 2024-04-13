import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { HttpClientModule } from '@angular/common/http';

import { Amplify } from 'aws-amplify';
import cdkOutput from '../../../../ForumWebCDK/output.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderBarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Forum-Web';

  constructor() {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: cdkOutput.CognitoStack.PoolId,
          userPoolClientId: cdkOutput.CognitoStack.ClientId,
          signUpVerificationMethod: 'code',
          loginWith: {
            username: true,
            email: true,
          }
        }
      }
    });
  }

  currentConfig = Amplify.getConfig();
}
