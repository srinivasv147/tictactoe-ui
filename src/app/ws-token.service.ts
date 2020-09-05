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
export class WsTokenService {
  private wsTokenUrl: string = environment.apiUrl + "/get-ws-ticket";

  getWsToken(): Observable<LoginResDTO>{

    let defaultLoginRes: LoginResDTO = {
        jwt : "DEFAULT",
        isUser : false,
        isValidEmail : false,
        userId : "DEFAULT"
    };

    return this.http.get<LoginResDTO>(this.wsTokenUrl)
    .pipe(
      catchError(() => {return of(defaultLoginRes);})
    );
  }

  constructor(private http: HttpClient) { }
}
