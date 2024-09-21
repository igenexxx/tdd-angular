import {Component, inject} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {finalize} from "rxjs";
import {NgIf} from "@angular/common";
import {AlertComponent} from "../shared/alert/alert.component";
import {ButtonComponent} from "../shared/button/button.component";
import {UserService} from "../core/user.service";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    NgIf,
    AlertComponent,
    ButtonComponent,
    FormsModule
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

  userService = inject(UserService);

  onClickSignUp() {
    this.isLoading = true;
    this.userService.signUp({
      username: this.username,
      email: this.email,
      password: this.password
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({ next: () => this.isSignUpSuccess = true });
  }
}
