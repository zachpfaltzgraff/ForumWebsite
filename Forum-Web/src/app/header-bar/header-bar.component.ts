import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-header-bar',
  standalone: true,
  imports: 
  [ButtonModule,
    MenuModule,
    ToastModule,
  ],
  templateUrl: './header-bar.component.html',
  styleUrl: './header-bar.component.css'
})
export class HeaderBarComponent {
  constructor(private router: Router, private messageService: MessageService) {};

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
              label: 'Feedback',
              icon: 'pi pi-phone',
              command: () => {
                this.router.navigate(['feedback']);
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
      this.messageService.add({ key: 'tc', severity: 'success', summary: 'Signed Out', detail: 'Page will reload in 1 second' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.reload();
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
    Window
  }
}
