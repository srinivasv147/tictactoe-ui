import { Component, OnInit } from '@angular/core';
import { GameDTO } from '../game-dto';
import { GameService } from '../game.service';
import { DefaultGame } from '../default-game';

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
    .subscribe(game => this.populateFields(game));
  }

  constructor(private gameService : GameService) { }

  ngOnInit(): void { 
    this.runningGame = false;
    this.populateFields(DefaultGame);
  }

}
