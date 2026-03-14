import { Component, inject,  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessBoard } from '../chess-logic/chessBoard';
import { ChessboardComponent } from '../board-component/board-component.component';
import { MychessAIService } from './myChessAI.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { ChessboardService } from '../board-component/chessboard.service';
import { ScoreBarComponent } from '../score-bar/score-bar.component';
//import { ChessboardService } from './chessboard.service';

@Component({
  selector: 'app-computer-mode',
    standalone: true,
    imports: [CommonModule, ScoreBarComponent /*, FormsModule, ...*/],
  templateUrl: '../board-component/board-component.component.html',
  styleUrls: ['../board-component/board-component.component.css']
})
export class ComputerModeComponent extends ChessboardComponent implements OnInit{
  private computerSubscriptions$ = new Subscription();

  

  constructor(private myChessAIService:MychessAIService){
    super(inject(ChessboardService));
  }
  ngOnInit(): void {

     // load score one time (or you may move this to parent)
    

    // subscribe to score updates
    const scoreSubscription = this.chessBoardService.score$.subscribe(value => {
      this.BoardEvaluation = value;
    });

    this.computerSubscriptions$.add(scoreSubscription);

    const chessBoardStateSubscription$: Subscription = this.chessBoardService.chessBoardState$.subscribe({
      next:async (FEN:string) => {
        const player:string = FEN.split(" ")[1];
        if(player == "w")return;

        const {prevX,prevY,newX,newY,promotedPiece} = await firstValueFrom(this.myChessAIService.getBestMove(FEN));
        this.updateBoard(prevX,prevY,newX,newY,promotedPiece);
        this.chessBoardService.loadScoreFromApi(FEN);
        //this.chessBoardService.loadScoreFromApi(this.chessBoard.boardAsFEN);
      }
    });
    this.computerSubscriptions$.add(chessBoardStateSubscription$);
    
  }

  public ngOnDestroy(): void{
    this.computerSubscriptions$.unsubscribe();
  }
}
