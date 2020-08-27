import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoginResDTO } from './login-res-dto'
import { SocialUser } from 'angularx-social-login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "./../environments/environment";
import { catchError, map, tap } from 'rxjs/operators';
import { LoginDTO } from './login-dto';
import { CreateUserDTO } from './create-user-dto';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {

  constructor(private http: HttpClient) { }

  private loginPostUrl: string = environment.apiUrl + "/create-user";

  createUser(socialUser : SocialUser, userId: string): Observable<LoginResDTO> {

    let loginDTO: LoginDTO = {
      token : socialUser.idToken,
      email : socialUser.email
    };

    let createUserDTO: CreateUserDTO = {
      loginDTO : loginDTO,
      userId : userId
    }

    let defaultLoginRes: LoginResDTO = {
        jwt : "DEFAULT",
        isUser : false,
        isValidEmail : false,
        userId : "DEFAULT"
    };
    return this.http.post<LoginResDTO>(this.loginPostUrl, createUserDTO)
    .pipe(
      catchError(() => {return of(defaultLoginRes);})
    );
  }
}
