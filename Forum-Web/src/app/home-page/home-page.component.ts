import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import cdkOutput from '../../../../../ForumWebCDK/output.json';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CredentailsService } from '../../../credentials.service';

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
    private messageService: MessageService,
    private credentialService: CredentailsService) {};

  showCreatePost: boolean = false;
  showExistingPost: boolean = false;
  hideCreatePost: boolean = false;
  apiEndpoint = cdkOutput.LambdaAPIStack.APIEndpoint1793E782;
  userData: any;
  loading: boolean = false;
  formGroups: FormGroup[] = [];
  commentArray: { username: string, comment: string }[] = [];
  isLiked: boolean[] = [];
  isSaved: boolean[] = [];
  showComment: boolean = false;
  hideComment: boolean = false;
  contentShown: number = 0;
  currentUUID: string = '';
  currentDate: string = '';

  items: MenuItem[] = [
    {label: 'Newest',
      icon: 'pi pi-star',
      command: () => {
        if (this.credentialService.getLogin() == true) {
          this.contentShown = 0;
        }
        else {
          this.router.navigate(['login'])
        }
      }
    },
    {
      label: 'Liked',
      icon: 'pi pi-heart',
      command: () => {
        if (this.credentialService.getLogin() == true) {
          this.contentShown = 1;
        }
        else {
          this.router.navigate(['login'])
        }
      }
    },
    {
      label: 'Saved',
      icon: 'pi pi-bookmark',
      command: () => {
        if (this.credentialService.getLogin() == true) {
          this.contentShown = 2;
        }
        else {
          this.router.navigate(['login'])
        }
      }
    },
  ];
  activeItem: MenuItem = this.items[0];

  async ngOnInit() {
    console.log(1)
    try {
      this.http.get<any>(this.apiEndpoint + 'forum/get-forum-data')
      .pipe(catchError(error => {
        console.error('Error: ', error);
        console.log(3)
        return throwError(error);
      }))
      .subscribe(response => {
        console.log(2)
        this.userData = response.data;
        
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
    } catch (error) {
      console.log(error)
    }
  }

  likeArrayHasUsername(item: any) {
    const likeArray = item.value.likeArray.L;
    for (let i = 0; i < likeArray.length; i++) {
      if (likeArray[i].S == this.credentialService.getUsername()) {
          return true;
      }
    }
    return false;
  }

  saveArrayHasUsername(item: any) {
    const saveArray = item.value.saveArray.L;
    for (let i = 0; i < saveArray.length; i++) {
      if (saveArray[i].S == this.credentialService.getUsername()) {
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
      username: this.credentialService.getUsername(),
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
    if(this.credentialService.getLogin() == false) {
      this.router.navigate(['/login']);
    }
    else {
      this.showCreatePost = true;
    }
  }

  async postBtnClick(formGroup: FormGroup, btnClicked: String, index: number) {
    if(this.credentialService.getLogin() == false) {
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
        accountID: this.credentialService.getUsername(),
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
        accountID: this.credentialService.getUsername(),
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
      

      this.currentUUID = formGroup.value.UUID;
      this.currentDate = formGroup.value.dateCreated;
      this.commentsForm.patchValue({
        title: formGroup.value.title,
        username: formGroup.value.username,
      });

      this.commentArray = [];
      for (let index = formGroup.value.commentArray.L.length - 1; index >= 0; index--) {
        const commentItem = formGroup.value.commentArray.L[index].M;
        this.commentArray.push({
          username: "●" + commentItem.username.S,
          comment: commentItem.comment.S
        });
      }
    }
  }

  async sendComment(commentForm: FormGroup) {
    if (commentForm.value.comment == '') {
      this.messageService.add({ key: 'tc', severity: 'error', summary: 'Error', detail: 'Cannot post blank comment'});
      return;
    }
    const formData = {
      uuid: this.currentUUID,
      dateCreated: this.currentDate,
      username: this.credentialService.getUsername(),
      comment: commentForm.value.comment,
    }
    console.log(formData)

    this.http.put(this.apiEndpoint + 'forum/comment-put', formData)
    .pipe(
      catchError(error => {
        console.error('Error: ', error);
        return throwError(error);
      })
    )
    .subscribe(response => {
      console.log('Response: ', response);
    });

    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Comment Posted', detail: 'Changes will be seen when refreshed'});
  }

  async removeComments() {
    this.hideComment = true;
    await new Promise(resolve => setTimeout(resolve, 300));
    this.hideComment = false;
    this.showComment = false;
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

  commentsForm = new FormGroup({
    username: new FormControl([]),
    title: new FormControl(''),
    comments: new FormControl([]),
  })

  newComment = new FormGroup({
    comment: new FormControl(''),
  })
}
