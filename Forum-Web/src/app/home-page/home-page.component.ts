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
import { TabMenuModule } from 'primeng/tabmenu';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ CommonModule,
    ButtonModule, 
    InputTextModule, 
    InputTextareaModule, 
    ReactiveFormsModule,
    TabMenuModule,
    ToastModule],
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
  constructor(private router: Router, 
    private http: HttpClient, 
    private formBuilder: FormBuilder,
    private messageService: MessageService) {};

  accUsername: string = '';
  showCreatePost: boolean = false;
  showExistingPost: boolean = false;
  hideCreatePost: boolean = false;
  apiEndpoint = cdkOutput.LambdaAPIStack.APIEndpoint1793E782;
  userData: any;
  loading: boolean = false;
  formGroups: FormGroup[] = [];
  isLiked: boolean[] = [];
  isSaved: boolean[] = [];
  showComment: boolean = false;
  contentShown: number = 0;
  items: MenuItem[] = [
    {label: 'Newest',
      icon: 'pi pi-star',
      command: () => {
        this.contentShown = 0;
      }
    },
    {
      label: 'Liked',
      icon: 'pi pi-heart',
      command: () => {
        this.contentShown = 1;
      }
    },
    {
      label: 'Saved',
      icon: 'pi pi-bookmark',
      command: () => {
        this.contentShown = 2;
      }
    },
  ];
  activeItem: MenuItem = this.items[0];

  async ngOnInit() {
    try {
      const {username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);
      this.accUsername = `${username}`;
    } catch (err) {
      this.accUsername = '';
    }

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

      this.formGroups.forEach((item: any, index: number) => {
        if (this.likeArrayHasUsername(item)) {
          this.isLiked[index] = true;
        } else {
          this.isLiked[index] = false;
        }

        if (this.saveArrayHasUsername(item)) {
          this.isSaved[index] = true;
        }
        else {
          this.isSaved[index] = false;
        }
      });
    });
  }

  likeArrayHasUsername(item: any) {
    const likeArray = item.value.likeArray.L;
    for (let i = 0; i < likeArray.length; i++) {
      if (likeArray[i].S == this.accUsername) {
          return true;
      }
    }
    return false;
  }

  saveArrayHasUsername(item: any) {
    const saveArray = item.value.saveArray.L;
    for (let i = 0; i < saveArray.length; i++) {
      if (saveArray[i].S == this.accUsername) {
          return true;
      }
    }
    return false;
  }

  createFormGroup(data: any): FormGroup {
  const dateCreated = new Date(data.dateCreated.S);

  return this.formBuilder.group({
    UUID: [data.UUID.S],
    username: ["●" + data.username.S || ''],
    title: [data.title.S || '', Validators.required],
    body: [data.body.S || '', Validators.required],
    likeArray: [data.likeArray || []],
    saveArray: [data.saveArray || []],
    commentArray: [data.commentArray || []],
    likeCount: [data.likeCount.N || 0],
    dateCreated: [dateCreated], 
  });
}

  createPost() {
    const date = new Date();
    this.loading = true;
    const formData = {
      username: this.accUsername,
      title: this.postForm.value.title,
      body: this.postForm.value.body,
      dateCreated: date,
      likeArray: [],
      saveArray: [],
      commentArray: [],
      likeCount: 0,
    }

    this.http.post(this.apiEndpoint + 'forum/post-forum-data', formData)
    .pipe(
      catchError(error => {
        console.error('Error: ', error);
        return throwError(error)  
      })
    ).subscribe(response => {
      this.loading = false;
      this.messageService.add({ key: 'tc', severity: 'success', summary: 'Post Created', detail: 'Page will reload shortly'});
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
    if(this.accUsername == '') {
      this.router.navigate(['/login']);
    }
    else {
      this.showCreatePost = true;
    }
  }

  async postBtnClick(formGroup: FormGroup, btnClicked: String, index: number) {
    if(this.accUsername == '') {
      this.router.navigate(['/login']);
      return;
    }

    if (btnClicked == 'like') {
      console.log("like btn clicked")
      formGroup.value.likeCount++;
      this.isLiked[index] = true;

      const formData = {
        UUID: formGroup.value.UUID,
        dateCreated: formGroup.value.dateCreated,
        likeCount: formGroup.value.likeCount,
        accountID: this.accUsername,
      }

      console.log(formData)

      this.http.put(this.apiEndpoint + 'forum/like-update', formData)
        .pipe(
          catchError(error => {
            console.error('Error: ', error);
            return throwError(error);
          })
        )
        .subscribe(response => {
          console.log('Response: ', response);
        });
    }
    else if (btnClicked == 'dislike') {
      console.log("Dislike cicked")
      formGroup.value.likeCount--;
      this.isLiked[index] = false;

      const formData = {
        UUID: formGroup.value.UUID,
        dateCreated: formGroup.value.dateCreated,
        likeCount: formGroup.value.likeCount,
        index: index,
      }

      this.http.put(this.apiEndpoint + 'forum/like-delete', formData)
        .pipe(
          catchError(error => {
            console.error('Error: ', error);
            return throwError(error);
          })
        )
        .subscribe(response => {
          console.log('Response: ', response);
        });
    }
    else if (btnClicked == 'save') {
      console.log("save btn clicked")
      this.isSaved[index] = true;

      const formData = {
        UUID: formGroup.value.UUID,
        dateCreated: formGroup.value.dateCreated,
        accountID: this.accUsername,
      }
      console.log(formData)

      this.http.put(this.apiEndpoint + 'forum/save-update', formData)
      .pipe(
        catchError(error => {
          console.error('Error: ', error);
          return throwError(error);
        })
      )
      .subscribe(response => {
        console.log('Response: ', response);
      });
    }
    else if( btnClicked == 'unsave') {
      this.isSaved[index] = false;

      const formData = {
        UUID: formGroup.value.UUID,
        dateCreated: formGroup.value.dateCreated,
        index: index,
      }
      console.log(formData)

      this.http.put(this.apiEndpoint + 'forum/save-delete', formData)
      .pipe(
        catchError(error => {
          console.error('Error: ', error);
          return throwError(error);
        })
      )
      .subscribe(response => {
        console.log('Response: ', response);
      });
    }
    else if (btnClicked == 'comment') {
      this.showComment = true;
      console.log("comment btn clicked")
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
  });

  existingPostForm = new FormGroup({
    username: new FormControl(''),
    title: new FormControl(''),
    body: new FormControl(''),
    likeArray: new FormControl([]),
    saveArray: new FormControl([]),
    commentArray: new FormControl([]),
    likeCount: new FormControl(0),
  })
}
