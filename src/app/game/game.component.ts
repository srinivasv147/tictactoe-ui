import { Component, OnInit } from '@angular/core';
import { GameDTO } from '../game-dto';
import { GameService } from '../game.service';
import { WsTokenService } from '../ws-token.service';
import { DefaultGame } from '../default-game';
import { Router } from "@angular/router";
import { RxStompService } from '@stomp/ng2-stompjs';
import { ChallengeDTO } from '../challenge-dto';
import { CookieService } from 'ngx-cookie-service';
import { MessageContainer } from '../message-container';
import { Message } from '@stomp/stompjs';
import { stompConfig } from '../my-rx-stomp.config';
import { environment } from 'src/environments/environment';
import { TwoPGameDTO } from '../two-p-game-dto';

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
  public receivedChallenges: MessageContainer<ChallengeDTO> 
  = new MessageContainer<ChallengeDTO>(10);
  challengeSubscription: any;
  gameSubscription: any;
  isTwoPGame: boolean;
  twoPGame: TwoPGameDTO;

  startOnePlayerGame(player: number){
    this.isTwoPGame = false;
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
      if(this.isTwoPGame){
        this.twoPGame.gameState = this.game;
        this.rxStompService.publish({destination: '/app/game-move'
    , body: JSON.stringify(this.twoPGame)});
      }
      else{
        this.getNextMove(this.game.gameState);
      }
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
      id : 0, 
      challengee : data.userId,
      challenger : currUserId,
      isChallengerX : true
    };
    console.log("sending challenge");
    this.rxStompService.publish({destination: '/app/challenge'
    , body: JSON.stringify(challengeDTO)});
  }

  sendChallengeAcceptance(challenge: ChallengeDTO){
    this.rxStompService.publish({destination: '/app/accept-challenge'
    , body: JSON.stringify(challenge)});
  }

  constructor(private gameService : GameService
    , private router : Router
    , private rxStompService: RxStompService
    , private cookieService : CookieService
    , private wsTokenService : WsTokenService) { }

  ngOnInit(): void { 
    this.runningGame = false;
    this.populateFields(DefaultGame);
    if(this.cookieService.check("tictactoe-srinivasv147-jwt")){
      this.wsTokenService.getWsToken().subscribe(tokenObject =>{
        //console.log(tokenObject+"hello");
        if(tokenObject.jwt !== "DEFAULT"){
          stompConfig.brokerURL 
          = environment.wsUrl+"?token="+tokenObject.jwt;
          console.log(stompConfig);
          this.rxStompService.configure(stompConfig);
          this.rxStompService.activate();

          this.challengeSubscription = this.rxStompService
          .watch('/user/queue/challenge')
          .subscribe((message: Message) => {
            //console.log(message.body)
            let challenge : ChallengeDTO = JSON.parse(message.body);
            this.receivedChallenges.insert(challenge);
          });
          
          this.gameSubscription = this.rxStompService
          .watch('/user/queue/game')
          .subscribe((message: Message)=>{
            let game : TwoPGameDTO = JSON.parse(message.body);
            let curUser = this.cookieService.get('tictactoe-srinivasv147-user');
            if(game.xUser === curUser) this.playerVal = 1;
            else this.playerVal = -1;
            this.runningGame = true;
            this.isTwoPGame = true;
            this.twoPGame = game;
            this.populateFields(game.gameState);
          });
        }
      });
    }
    
  }

  ngOnDestroy() {
    if(this.cookieService.check("tictactoe-srinivasv147-jwt")) {
      this.challengeSubscription.unsubscribe();
      this.gameSubscription.unsubscribe();
    }
  }

}
