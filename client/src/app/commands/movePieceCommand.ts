import { Chessgame } from "../chessgame/chessgame";


export class MovePieceCommand implements Command{
    private chessGame: Chessgame;
    private to: number;
    private from: number;

    constructor(
         chessgame: Chessgame,
         to: number,
         from: number
    ){
        this.chessGame = chessgame;
        this.to = to;
        this.from = from;
    }
    execute(): void {
       this.chessGame.movePiece(this.from,this.to)
    }
    undo(): void {
        throw new Error("Method not implemented.");
    }


}