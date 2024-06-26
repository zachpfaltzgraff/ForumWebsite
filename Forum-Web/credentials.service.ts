import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CredentailsService {
  private userEmail: string = '';
  private username: string = '';
  private isLoggedIn: boolean = false;

  setUsername(username: string) {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  setEmail(email: string) {
    this.userEmail = email;
  }

  getEmail(): string {
    return this.userEmail;
  }

  setLogin(loggedIn: boolean) {
    this.isLoggedIn = loggedIn;
  }
  getLogin(): boolean {
    return this.isLoggedIn;
  }
}
