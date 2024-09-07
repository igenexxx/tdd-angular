import {Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {finalize} from "rxjs";
import {NgIf} from "@angular/common";
import {AlertComponent} from "../shared/alert/alert.component";
import {ButtonComponent} from "../shared/button/button.component";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    NgIf,
    AlertComponent,
    ButtonComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  email = '';
  username = '';
  password: string = '';
  passwordRepeat: string = '';
  disabled = true;
  isLoading = false;
  isSignUpSuccess = false;

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
    this.isLoading = true;
    this.http.post('/api/1.0/users', {
      username: this.username,
      email: this.email,
      password: this.password,
    }).pipe(
      finalize(() => this.isLoading = false),
    ).subscribe(() => {
      this.isSignUpSuccess = true;
    });
  }
}
