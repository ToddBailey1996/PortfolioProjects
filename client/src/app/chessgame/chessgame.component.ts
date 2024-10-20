import { Component, OnInit } from '@angular/core';
import { ChessboardComponent } from "../chessboard/chessboard.component";
import { Chessgame } from './chessgame';
import { MovePieceCommand } from '../commands/movePieceCommand';

@Component({
  selector: 'app-chessgame',
  standalone: true,
  imports: [ChessboardComponent],
  templateUrl: './chessgame.component.html',
  styleUrl: './chessgame.component.css'
})
export class ChessgameComponent implements OnInit {
    game: Chessgame;

    constructor(){
        this.game = new Chessgame();
    }

  ngOnInit(): void {
    this.initialiseChessBoard();
  }
  initialiseChessBoard() {
      this.game.reset();
    
  }

  resetGame() {
    this.initialiseChessBoard();
  }

  movePiece(to:number, from: number){
     let command = new MovePieceCommand(this.game,to,from);
     command.execute();
  }

}
