import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Amplify } from 'aws-amplify';

Amplify.configure(Amplify.getConfig());

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ButtonModule, InputTextModule, InputTextareaModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  constructor(private router: Router) {};

  showCreatePost: boolean = false;

  createPost() {

  }

  async toggleCreatePost() {
    try {
      const {username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);

      this.showCreatePost = true;
    } catch (error) {
      console.log(error);
      this.router.navigate(['/login']);
    }
  }
  postForm = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required)
  });

}
