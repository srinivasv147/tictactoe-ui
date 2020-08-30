import { Component, OnInit } from '@angular/core';
import { GameDTO } from '../game-dto';
import { GameService } from '../game.service';
import { DefaultGame } from '../default-game';
import { Router } from "@angular/router";
import { RxStompService } from '@stomp/ng2-stompjs';
import { ChallengeDTO } from '../challenge-dto';
import { CookieService } from 'ngx-cookie-service';
import { MessageContainer } from '../message-container';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  
  game: GameDTO;
  gameDisplay: string[] = [];
  runningGame: boolean;
  playerVal: number;
  public receivedChallenges: MessageContainer<string> 
  = new MessageContainer<string>(10);

  setPlayer(player: number){
    this.playerVal = player;
    this.runningGame = true;
    this.populateFields(DefaultGame);
    if(this.playerVal == -1){
      this.getNextMove(DefaultGame.gameState);
    }
  }

  registerMove(move: number){
    if(this.runningGame && this.game.gameResult === "UNDECIDED"){
      this.game.gameState[move] = this.playerVal;
      this.getNextMove(this.game.gameState);
    }
    if(this.game.gameResult != "UNDECIDED"){
      this.runningGame = false;
    }
  }

  populateFields(game: GameDTO): void{
    this.game = JSON.parse(JSON.stringify(game));//deep copy
    this.gameDisplay = [];
    for(var i = 0; i < 9; i++){
      if(this.game.gameState[i] === 1) this.gameDisplay.push("X");
      else if(this.game.gameState[i] === -1) this.gameDisplay.push("O");
      else this.gameDisplay.push("_");
    }
  }

  getNextMove(curGameState: number[]): void{
    this.gameService
    .getGame(curGameState)
    .subscribe(game => {
      this.populateFields(game);
      if(JSON.stringify(game) == JSON.stringify(DefaultGame)){
        this.router.navigateByUrl('/login');
      } 
    });
  }

  sendChallenge(data) {
    let currUserId: string 
    = this.cookieService.get("tictactoe-srinivasv147-user");
    let challengeDTO: ChallengeDTO = {
      challengee : data.userId,
      challenger : currUserId,
      isChallengerX : true
    };
    this.rxStompService.publish({destination: '/app/challenge'
    , body: JSON.stringify(challengeDTO)});
  }

  constructor(private gameService : GameService
    , private router : Router
    , private rxStompService: RxStompService
    , private cookieService : CookieService) { }

  ngOnInit(): void { 
    this.runningGame = false;
    this.populateFields(DefaultGame);
    this.rxStompService.watch('/user/topic/challenge').subscribe((message: Message) => {
      this.receivedChallenges.insert(message.body);
    });
  }

}
