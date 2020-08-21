import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable,of } from 'rxjs';
import { GameService } from './game.service';
import { DefaultGame } from './default-game';
import { ignoreElements } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private gameService : GameService
    , private router : Router) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.gameService
      .getGame([0,0,0,0,0,0,0,0,0])
      .subscribe(game => {
        if(JSON.stringify(game) == JSON.stringify(DefaultGame)){
          this.router.navigateByUrl('/login');
        } 
      });
      return true;
  }
  
}
