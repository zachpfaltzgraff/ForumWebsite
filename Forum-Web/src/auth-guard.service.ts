import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { SourceTextModule } from 'vm';

@Injectable()
export class AuthGuardService {
  constructor(public router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    try {
      const user = await getCurrentUser();
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return this.router.parseUrl('/login');
    }
  }

  async canAdminActivate() {
    try {
      const user = await getCurrentUser();
      if (user) {
        if (await this.isAdmin(this.router)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async isAdmin(router: Router): Promise<boolean> {
    try {
      const res = await fetchAuthSession();
      const groups = res.tokens?.accessToken.payload?.['cognito:groups'] as string[] || [];
      if (groups.includes('admins')) {
        console.log("Admin Confirmed");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
