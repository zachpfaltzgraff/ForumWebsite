import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputOtpModule } from 'primeng/inputotp';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { signUp } from 'aws-amplify/auth';
import { confirmSignUp, type ConfirmSignUpInput } from 'aws-amplify/auth';
import { Router } from '@angular/router'

type SignUpParameters = {
  username: string;
  password: string;
  email: string;
};

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, 
    ButtonModule, 
    FloatLabelModule, 
    InputTextModule, 
    PasswordModule,
    ToastModule,
    CommonModule,
    InputOtpModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  constructor(private messageService: MessageService, private router: Router) {}

  showCode: boolean = false;
  
  async onSignUp() {
    if (this.signupForm.valid) {
      console.log("valid form");
      const formData = {
        username: this.signupForm.value.username ?? '',
        email: this.signupForm.value.email ?? '',
        password: this.signupForm.value.password ?? '',
      }
      console.log(formData);

      await handleSignUp({ username: formData.username, password: formData.password, email: formData.email});
      
      this.showCode = true;

    } else {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Invalid Form' });
    }
  }

  async onLogin() {
    if (this.loginForm.valid) {
      console.log("valid form")
      const formData = {
        username: this.loginForm.value.username ?? '',
        password: this.loginForm.value.password ?? '',
      }

      await handleSignIn({username: formData.username, password: formData.password})
      console.log("signed in");
      this.router.navigate(['']);
      
    } else {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Invalid Form' });
    }
  }

  async onConfirm() {
    if (this.confirmCodeForm.valid) {
      const formData = {
        username: this.signupForm.value.username ?? '',
        code: this.confirmCodeForm.value.code ?? '',
      }

      await handleSignUpConfirmation({username: formData.username, confirmationCode: formData.code}, this.router);
      console.log("Confirmation complete")
      console.log(formData.username + ' ' + this.signupForm.value.password)
      await handleSignIn({username: formData.username, password: this.signupForm.value.password ?? ''})
      
    } else {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Invalid Form' });
    }
  }

  signupForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  });

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required)
  });

  confirmCodeForm = new FormGroup({
    code: new FormControl(null, Validators.required),
  })
}

async function handleSignUp(this: any, {
  username,
  password,
  email,
}: SignUpParameters) {
  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
        },
      }
    });

    console.log(userId);
  } catch (error) {
    alert(error);
    console.log('error signing up:', error);
  }
}

async function handleSignUpConfirmation({
  username,
  confirmationCode
}: ConfirmSignUpInput, router: Router) {
  try {
    const { isSignUpComplete, nextStep } = await confirmSignUp({
      username,
      confirmationCode
    });
  } catch (error) {
    alert(error)
    console.log('error confirming sign up', error);
    router.navigate(['']);
  }
}

import { signIn, type SignInInput } from 'aws-amplify/auth';

async function handleSignIn({ username, password }: SignInInput) {
  try {
    const { isSignedIn, nextStep } = await signIn({ username, password });
  } catch (error) {
    console.log('error signing in', error);
  }
}