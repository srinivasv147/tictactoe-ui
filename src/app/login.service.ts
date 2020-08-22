import { Injectable } from '@angular/core';
import { LoginDTO } from './login-dto';
import { LoginResDTO } from './login-res-dto'
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { SocialUser } from "angularx-social-login";
import { environment } from "./../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginPostUrl: string = environment.apiUrl + "/authenticate";

  getLoginToken(socialUser: SocialUser): Observable<LoginResDTO>{
    let loginDTO: LoginDTO = {
        token : socialUser.idToken,
        email : socialUser.email
    };

    let defaultLoginRes: LoginResDTO = {
        jwt : "DEFAULT"
    };

    return this.http.post<LoginResDTO>(this.loginPostUrl, loginDTO)
    .pipe(
      catchError(() => {return of(defaultLoginRes);})
    );
  }

  constructor(private http: HttpClient) { }
}
