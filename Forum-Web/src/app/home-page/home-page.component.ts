import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  showCreatePost: boolean = false;

  createPost() {

  }

  toggleCreatePost() {
    console.log(1)
    this.showCreatePost = true;
  }

  postForm = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required)
  });

}
