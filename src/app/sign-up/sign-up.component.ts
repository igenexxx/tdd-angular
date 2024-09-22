import {Component, inject} from '@angular/core';
import {finalize} from "rxjs";
import {JsonPipe, NgIf} from "@angular/common";
import {AlertComponent} from "../shared/alert/alert.component";
import {ButtonComponent} from "../shared/button/button.component";
import {UserService} from "../core/user.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

type NonNullableProperties<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    NgIf,
    AlertComponent,
    ButtonComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl(''),
    password: new FormControl(''),
    passwordRepeat: new FormControl(''),
  })
  disabled = true;
  isLoading = false;
  isSignUpSuccess = false;

  userService = inject(UserService);

  onClickSignUp() {
    const { passwordRepeat, ...formBody } = this.form.value;
    this.isLoading = true;
    this.userService.signUp(formBody as NonNullableProperties<typeof formBody>).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({ next: () => this.isSignUpSuccess = true });
  }

  get isDisabled(): boolean {
    return !this.form.get('password')?.value || this.form.get('password')?.value !== this.form.get('passwordRepeat')?.value;
  }
}
