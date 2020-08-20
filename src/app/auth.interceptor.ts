import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService : CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const jwt = this.cookieService.get("tictactoe-srinivasv147-jwt");
    if(jwt && jwt != ""){
      const clone = request.clone({
        headers : request.headers.set("Authorization","Bearer "+jwt)
      });
      return next.handle(clone);
    }
    return next.handle(request);
  }
}
