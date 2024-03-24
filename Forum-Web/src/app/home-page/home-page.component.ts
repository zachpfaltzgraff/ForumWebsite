import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

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
  hideCreatePost: boolean = false;

  createPost() {

  }

  async deleteForm() {
    this.hideCreatePost = true;

    await new Promise(resolve => setTimeout(resolve, 300));
    this.showCreatePost = false;
    this.hideCreatePost = false;
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
    body: new FormControl('', Validators.required),
    likeCount: new FormControl(0),
    saveCount: new FormControl(0),
  });

  existingPostForm = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    likeCount: new FormControl(null),
    saveCount: new FormControl(null),
  })

}
