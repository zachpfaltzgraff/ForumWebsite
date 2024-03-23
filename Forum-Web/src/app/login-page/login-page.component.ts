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
  constructor(private messageService: MessageService) {}

  showCode: boolean = false;

  onSignUp() {
    if (this.signupForm.valid) {
      console.log("valid form");
      const formData = {
        username: this.signupForm.value.username ?? '',
        email: this.signupForm.value.email ?? '',
        password: this.signupForm.value.password ?? '',
      }
      console.log(formData);

      handleSignUp({ username: formData.username, password: formData.password, email: formData.email });
      this.showCode = true;

      // make verify page show

    } else {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Invalid Form' });
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log("valid form")
      const formData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      }
      console.log(formData);
      
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
    email: new FormControl(this.signupForm.value.email, [Validators.required]),
    code: new FormControl(null, Validators.required),
  })
}

async function handleSignUp({
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
    console.log('error signing up:', error);
    // Handle error here
  }
}