import { Component } from '@angular/core';

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [],
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.css'
})
export class ChessboardComponent {

  resetBoard(pieces:string[],colours:string[]){
    
    for (let i = 0; i < 64;i++ ){
      switch(pieces[i]){
        case 'PAWN': {
          break;
        }
        case 'ROOK': {
          break;
        }
        case 'KNIGHT': {
          break;
        }
        case 'BISHOP': {
          break;
        }
        case 'KING': {
          break;
        }
        case 'QUEEN': {
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  setpiece(){

  }
  
}
