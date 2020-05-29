import { Component, OnInit } from '@angular/core';
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginResult: string

  constructor(private authService: AuthService) { }

  sendToRestApiMethod(socialUser: SocialUser){
    this.loginResult = socialUser.firstName+" logged in";
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
