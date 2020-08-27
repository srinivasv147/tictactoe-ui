import { Component, OnInit } from '@angular/core';
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { LoginService } from '../login.service';
import { CreateUserService } from '../create-user.service';
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
  displayNewUserForm: boolean = false;
  currentSocialUser: SocialUser;

  constructor(private authService: AuthService
    , private loginService: LoginService
    , private createUserService: CreateUserService
    , private router : Router
    , private cookieService : CookieService) { }


  populatePage(loginResponse : LoginResDTO, message: string){
    if(loginResponse.isValidEmail && loginResponse.isUser){
      this.createCookie(loginResponse);
      this.router.navigate(['']);
    }
    else if(loginResponse.isValidEmail){
      this.loginResult = message;
      this.displayNewUserForm = true;
    }
    else{
      this.loginSuccess = false;
      this.loginResult = "failed to login in, invalid email";
    }
  }

  createCookie(loginResponse: LoginResDTO): void{
    if(loginResponse.jwt === "DEFAULT"){
      this.loginSuccess = false;
      return;
    }
    this.cookieService.set("tictactoe-srinivasv147-jwt"
    , loginResponse.jwt);
  }

  sendToRestApiMethod(socialUser: SocialUser){
    this.currentSocialUser = socialUser;
    this.loginService
    .getLoginToken(socialUser)
    .subscribe(loginResponse => {
      this.populatePage(loginResponse, "looks like this is your first " +
      "time on the site, please enter a unique user id " +
      "to finish logging in");
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    .then((userData)=>{
      this.sendToRestApiMethod(userData);
    });
  }

  onUserIdSubmit(data){
    //console.log(data.userId);
    this.createUserService
    .createUser(this.currentSocialUser, data.userId)
    .subscribe(loginResponse =>{
      this.populatePage(loginResponse, "entered user id is not unique "+
      "please enter a new user id")
    });
  }

  ngOnInit(): void {
    
    this.loginResult = "no one has logged in";
  }

}
