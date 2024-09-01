import {Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  email = '';
  username = '';
  password: string = '';
  passwordRepeat: string = '';
  disabled = true;

  http = inject(HttpClient);

  onChangePassword($event: Event) {
    this.password = ($event.target as HTMLInputElement).value;
    this.updateDisabledStatus();
  }

  onChangePasswordRepeat($event: Event) {
    this.passwordRepeat = ($event.target as HTMLInputElement).value;
    this.updateDisabledStatus();
  }

  updateDisabledStatus(): void {
    if (!this.password && !this.passwordRepeat) {
      return;
    }

    this.disabled = this.password !== this.passwordRepeat;
  }

  onChangeUsername($event: Event) {
    this.username = ($event.target as HTMLInputElement).value;
  }

  onChangeEmail($event: Event) {
    this.email = ($event.target as HTMLInputElement).value;
  }

  onClickSignUp() {
    fetch('/api/1.0/users', {
      method: 'POST',
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        email: this.email,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
