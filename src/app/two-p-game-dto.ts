import { GameDTO } from './game-dto'

export interface TwoPGameDTO{

    gameId: number,
    xUser: string,
    oUser: string,
    nextMoveX: boolean,
    gameState: GameDTO

}