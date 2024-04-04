import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: 
  [ButtonModule,
    MenuModule
  ],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  constructor(private router: Router) {};

  isSignedIn: boolean = false;
  items: MenuItem[] = [
    {
        items: [
            {
                label: 'Home',
                icon: 'pi pi-home',
                command: () => {
                  this.router.navigate(['']);
                }
            },
            {
              label: 'Contact Us',
              icon: 'pi pi-phone',
              command: () => {
                
              }
            },
            {
                label: 'About Us',
                icon: 'pi pi-question-circle',
                command: () => {
                  
                }
            }
        ]
    },
];

  async ngOnInit() {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log(`The signInDetails: ${signInDetails}`);
        this.isSignedIn = true;

      } catch (err) {
        this.isSignedIn = false;
        console.log(err);
      }
  }

  async handleClick() {
    if (this.isSignedIn) {
      await handleSignOut();
      this.isSignedIn = false;
      alert("Signed Out")
    } else {
      this.router.navigate(['login'])
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
