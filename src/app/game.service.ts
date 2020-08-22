import { Injectable } from '@angular/core';
import { GameDTO } from './game-dto';
import { DefaultGame } from './default-game';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from "./../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private getUrl: string = environment.apiUrl + "/game/";

  getGame(game: number[]): Observable<GameDTO> {
    return this.http.get<GameDTO>(this.getUrl+game)
    .pipe(
      catchError(() => {return of(DefaultGame);})
    );
  }
  constructor(private http: HttpClient) { }
}
