import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  constructor(private router: Router) {};

  isLoggedIn: boolean = false;

  ngOnInit() {
    this.currentUser();
  }
  
  async currentUser() {
    try {
      const {username, userId, signInDetails } = await getCurrentUser();

      this.isLoggedIn = true;

    } catch (error) {
      this.isLoggedIn = false;
      console.log(error);
    }
  }

  async handleClick() {
    if (this.isLoggedIn) {
      await handleSignOut();
      this.router.navigate(['']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}
