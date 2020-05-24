import { Component, OnInit } from '@angular/core';
import { GameDTO } from '../game-dto';
import { GameService } from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  
  game: GameDTO;
  gameDisplay: string[] = [];

  registerMove(move: number){
    this.game.gameState[move] = -1;
    this.getNextMove(this.game.gameState);
  }

  populateFields(game: GameDTO): void{
    this.game = game;
    this.gameDisplay = [];
    for(var i = 0; i < 9; i++){
      if(game.gameState[i] === 1) this.gameDisplay.push("X");
      else if(game.gameState[i] === -1) this.gameDisplay.push("O");
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
    this.getNextMove([0,0,0,0,0,0,0,0,0]);
    console.log(this.gameDisplay);
  }

}
