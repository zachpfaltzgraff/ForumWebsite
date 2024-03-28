import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import cdkOutput from '../../../../../ForumWebCDK/output.json';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ CommonModule,
    ButtonModule, 
    InputTextModule, 
    InputTextareaModule, 
    ReactiveFormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  animations: [
    trigger('slideUp', [
      state('void', style({
        transform: 'translateY(100%)',
      })),
      transition(':enter', [
        animate('0.3s ease-out', style({
          transform: 'translateY(0)',
        }))
      ])
    ])
  ]
})

export class HomePageComponent {
  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder) {};

  accUsername: String = '';
  showCreatePost: boolean = false;
  showExistingPost: boolean = false;
  hideCreatePost: boolean = false;
  apiEndpoint = cdkOutput.LambdaAPIStack.APIEndpoint1793E782;
  userData: any;
  formGroups: FormGroup[] = [];

  async ngOnInit() {

    this.http.get<any>(this.apiEndpoint + 'forum/get-forum-data')
    .pipe(catchError(error => {
      console.error('Error: ', error);
      return throwError(error);
    }))
    .subscribe(response => {
      this.userData = response.data;
      console.log(response.data);
      this.formGroups = this.userData.map((item: any) => this.createFormGroup(item));

      this.formGroups.sort((a, b) => {
        const dateA = a.get('dateCreated')?.value;
        const dateB = b.get('dateCreated')?.value;
        return dateB - dateA;
      });
    });
  }

  createFormGroup(data: any): FormGroup {
  const dateCreated = new Date(data.dateCreated.S);

  return this.formBuilder.group({
    username: [data.username.S || ''],
    title: [data.title.S || '', Validators.required],
    body: [data.body.S || '', Validators.required],
    likeArray: [data.likeArray || []],
    saveArray: [data.saveArray || []],
    commentArray: [data.commentArray || []],
    likeCount: [data.likeCount || 0],
    saveCount: [data.saveCount || 0],
    dateCreated: [dateCreated], 
  });
}

  createPost() {
    const formData = {
      username: this.accUsername,
      title: this.postForm.value.title,
      body: this.postForm.value.body,
      likeArray: [],
      saveArray: [],
      commentArray: [],
      likeCount: 0,
      saveCount: 0,
    }

    console.log(this.apiEndpoint + 'forum/post-forum-data');

    this.http.post(this.apiEndpoint + 'forum/post-forum-data', formData)
    .pipe(
      catchError(error => {
        console.error('Error: ', error);
        return throwError(error)
      })
    ).subscribe(response => {
      alert("Posted successfully");
      console.log('Response: ', response);
      window.location.reload();
    })
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
      this.accUsername = `${username}`;
      

      this.showCreatePost = true;
    } catch (error) {
      console.log(error);
      this.router.navigate(['/login']);
    }
  }

  postForm = new FormGroup({
    username: new FormControl(''),
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    likeArray: new FormControl([]),
    saveArray: new FormControl([]),
    commentArray: new FormControl([]),
    likeCount: new FormControl(0),
    saveCount: new FormControl(0),
  });

  existingPostForm = new FormGroup({
    username: new FormControl(''),
    title: new FormControl(''),
    body: new FormControl(''),
    likeArray: new FormControl([]),
    saveArray: new FormControl([]),
    commentArray: new FormControl([]),
    likeCount: new FormControl(null),
    saveCount: new FormControl(null),
  })

}
