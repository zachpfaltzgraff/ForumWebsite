import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import {FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { resetPassword, type ResetPasswordOutput } from 'aws-amplify/auth';
import {confirmResetPassword, type ConfirmResetPasswordInput} from 'aws-amplify/auth';
import { Timeout } from 'aws-cdk-lib/aws-stepfunctions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery-page',
  standalone: true,
  imports: [ ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
    InputNumberModule,
    PasswordModule
  ],
  templateUrl: './recovery-page.component.html',
  styleUrl: './recovery-page.component.css',
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
export class RecoveryPageComponent {
  constructor (private messageService: MessageService, private router: Router) {};

  showCode: boolean = false;
  showPassword: boolean = false;
  getEmail() {
    if (this.recoveryForm.valid) {
      this.showCode = true;
      handleResetPassword(this.recoveryForm.value.email ?? '', this.messageService, this.router);
    } else {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Invalid Email' });
    }
  }

  getCode() {
    let length = this.recoveryForm.value.code?.toString().length;
    console.log(length)
    if (length != 6) {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Invalid Code' });
    } else {
      this.showPassword = true;
    }
  }

  getPassword() {
    if (this.recoveryForm.value.password != this.recoveryForm.value.password2) {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Passwords must match' });
    } else {
      handleConfirmResetPassword({ 
        username: this.recoveryForm.value.email ?? '', 
        confirmationCode: String(this.recoveryForm.value.code),
        newPassword: this.recoveryForm.value.password ?? '',
      }, this.messageService)
    }
  }

  recoveryForm = new FormGroup({ 
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl(''),
    password2: new FormControl(''),
    code: new FormControl(''),
  })
}

async function handleResetPassword(username: string, messageService: MessageService, router: Router) {
  try {
    const output = await resetPassword({ username });
    handleResetPasswordNextSteps(output); 
  } catch (error) {
    messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'No account tied to email' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.navigate(['']);
  }
}

async function handleConfirmResetPassword({
  username,
  confirmationCode,
  newPassword
}: ConfirmResetPasswordInput, messageService: MessageService) {
  try {
    await confirmResetPassword({ username, confirmationCode, newPassword });
    messageService.add({ key: 'bc', severity: 'success', summary: 'Error', detail: 'Password reset successfully' });
  } catch (error) {
    console.log(error);
    alert("Error: " + error + "\n Please try again later");
  }
}

function handleResetPasswordNextSteps(output: ResetPasswordOutput) {
  const { nextStep } = output;
  switch (nextStep.resetPasswordStep) {
    case 'CONFIRM_RESET_PASSWORD_WITH_CODE':
      const codeDeliveryDetails = nextStep.codeDeliveryDetails;
      console.log(
        `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
      );
      break;
    case 'DONE':
      console.log('Successfully reset password.');
      break;
  }
}
