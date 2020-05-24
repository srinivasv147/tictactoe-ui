import { Injectable } from '@angular/core';
import { GameDTO } from './game-dto';
import { MockGame } from './mock-game';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private getUrl: string = "http://127.0.0.1:8080/game/";
  private defaultGame: GameDTO = {valid: true
    , gameOver: false
    , gameResult: "UNDECIDED"
    , gameState: [0,0,0,0,0,0,0,0,0]};

  getGame(game: number[]): Observable<GameDTO> {
    return this.http.get<GameDTO>(this.getUrl+game)
    .pipe(
      catchError(() => {return of(this.defaultGame);})
    );
  }
  constructor(private http: HttpClient) { }
}
