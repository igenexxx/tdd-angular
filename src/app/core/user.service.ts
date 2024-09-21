import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

interface ISignUpBody {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  signUp(userInfo: ISignUpBody) {
    return this.http.post('/api/1.0/users', userInfo);
  }
}
