import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import cdkOutput from '../../../ForumWebsiteCDK/output.json';
import { Amplify } from 'aws-amplify';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error("ERROR:" , err));

    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: cdkOutput.CognitoStack.PoolID,
          userPoolClientId: cdkOutput.CognitoStack.ClientId,
          signUpVerificationMethod: 'code',
        }
      }
    });

    const currentConfig = Amplify.getConfig();
