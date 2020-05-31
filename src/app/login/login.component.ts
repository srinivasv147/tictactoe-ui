import { Component, OnInit } from '@angular/core';
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { LoginService } from '../login.service';
import { LoginResDTO } from '../login-res-dto';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginResult: string;
  loginSuccess: boolean = true;

  constructor(private authService: AuthService
    , private loginService: LoginService
    , private router : Router
    , private cookieService : CookieService) { }

  createCookie(loginResponse: LoginResDTO): void{
    if(loginResponse.jwt === "DEFAULT"){
      this.loginSuccess = false;
      return;
    }
    this.cookieService.set("tictactoe-srinivasv147-jwt"
    , loginResponse.jwt);
  }

  sendToRestApiMethod(socialUser: SocialUser){
    this.loginService
    .getLoginToken(socialUser)
    .subscribe(loginResponse => {this.createCookie(loginResponse)})
    if(this.loginSuccess){
      this.loginResult = socialUser.firstName+" logged in";
      this.router.navigate(['']);
    }
    else{
      this.loginResult = "failed to login";
    }
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((userData)=>{
      this.sendToRestApiMethod(userData);
    });
  }

  ngOnInit(): void {
    
    this.loginResult = "no one has logged in";
  }

}
