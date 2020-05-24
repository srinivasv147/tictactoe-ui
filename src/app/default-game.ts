import { GameDTO } from './game-dto';

export const DefaultGame: GameDTO = {
    valid: true,
    gameOver: false,
    gameState: [0,0,0,0,0,0,0,0,0],
    gameResult: "UNDECIDED"
};