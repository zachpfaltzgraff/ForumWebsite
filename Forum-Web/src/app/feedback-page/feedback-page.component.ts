import { Component } from '@angular/core';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [InputTextareaModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './feedback-page.component.html',
  styleUrl: './feedback-page.component.css'
})
export class FeedbackPageComponent {
  constructor(private messageService: MessageService, private router: Router) {};

  async sendMessage() {
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Message Sent', detail: 'You will be redirected in 1 second'});
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.router.navigate(['']);
  }
}
