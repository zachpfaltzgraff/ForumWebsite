import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AuthGuardService } from '../../auth-guard.service';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  isLoggedIn: boolean = false;

  ngOnInit() {
    this.currentUser();
  }
  
  async currentUser() {
    try {
      const {username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);

      this.isLoggedIn = true;
    } catch (error) {
      console.log(error);
      this.isLoggedIn = false;
    }
  }

  SignOut() {
    console.log("signing out")
    handleSignOut();
    this.isLoggedIn = false;
  }
 
}

async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}
