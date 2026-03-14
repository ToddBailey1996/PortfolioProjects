import { Component, OnInit ,Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessBoard } from '../chess-logic/chessBoard';
import { CheckState, Color, Coords, FENChar, pieceImagePaths, SafeSquares, SelectedSquare, LastMove} from '../chess-logic/models';
import { ChessboardService } from './chessboard.service';
import { ScoreBarComponent } from '../score-bar/score-bar.component';
//import {chessBoardService } from 'src\app\board-component\board-component.service.ts'
@Component({
  selector: 'ChessboardComponent',
  standalone: true,
  imports: [CommonModule, ScoreBarComponent /*, FormsModule, ...*/],
  templateUrl: './board-component.component.html',
  styleUrls: ['./board-component.component.css']
})
export class ChessboardComponent  {

  public pieceImagePaths = pieceImagePaths;
  private chessBoard = new ChessBoard();
  public chessBoardView: (FENChar|null)[][] = this.chessBoard.chessBoardView;
  public get playerColor(): Color { return this.chessBoard.playerColor;};
  private selectedSquare: SelectedSquare = {piece: null};
  private pieceSafeSquares: Coords[] = [];
  public get safeSquares(): SafeSquares {return this.chessBoard.safeSquares;}
  private lastMove:LastMove|undefined = this.chessBoard.lastMove;
  private checkState:CheckState = this.chessBoard.checkState;
  public get gameOverMessage():string|undefined {return this.chessBoard.gameOverMessage;};
  public flipMode:boolean = false;
  public BoardEvaluation:number = 0;
//promotion properties
@Output() FENString = new EventEmitter<string>();
public isPromotionActive: boolean = false;
private promotionCoords : Coords|null = null;
private promotedPiece: FENChar|null = null;

constructor(protected chessBoardService: ChessboardService) { }

 
public promotionPieces(): FENChar[]{
  return this.playerColor === Color.white ?
  [FENChar.whiteKnight,FENChar.blackBishop,FENChar.whiteRook,FENChar.whiteQueen] : 
  [FENChar.blackKnight,FENChar.blackBishop,FENChar.blackRook,FENChar.blackQueen] 
}
  public isSquareSelected(x:number, y:number): boolean{
    if(!this.selectedSquare.piece) return false;
    return this.selectedSquare.x ===x && this.selectedSquare.y === y;
  }

  public isSquareSafeForSelectedPiece(x:number , y:number): boolean{
    return this.pieceSafeSquares.some(Coord => Coord.x === x && Coord.y === y)
  }

  public selectingPiece(x:number, y:number): void{

    if(this.gameOverMessage !== undefined) return;

    const piece: FENChar | null = this.chessBoardView[x][y];
    if(!piece) return;
    if(this.isWrongPieceSelected(piece)) return;

    const isSameSquareClicked: boolean = !!this.selectedSquare.piece && this.selectedSquare.x === x && this.selectedSquare.y === y;
    this.unmarkPreviusSelectedSafeSquares();
    if(isSameSquareClicked) return;
    this.selectedSquare = {piece,x,y};
    this.pieceSafeSquares = this.safeSquares.get(x + "," + y) || [];
   }
   
  public isSquareDark(x:number, y:number): boolean{
    return ChessBoard.isSquareDark(x,y);
  }
  private isWrongPieceSelected(piece:FENChar): boolean{
    const isWhitePieceSelected: boolean = piece === piece.toUpperCase();
    return isWhitePieceSelected && this.playerColor === Color.black || !isWhitePieceSelected && this.playerColor == Color.white;
  }

  private placingPiece(newX:number, newY:number): void{
    if(!this.selectedSquare.piece) return;
    if(!this.isSquareSafeForSelectedPiece(newX,newY)) return;

    //pawn promotion 
    const isPawnSelected: boolean = this.selectedSquare.piece === FENChar.whitePawn || this.selectedSquare.piece === FENChar.blackPawn;
    const isPawnOnLastRank: boolean = isPawnSelected &&  (newX === 7 || newX === 0);
    const shouldOpenPromotionDialog: boolean = !this.isPromotionActive && isPawnOnLastRank;
    /*console.log(this.isPromotionActive);
    console.log(isPawnOnLastRank);
    console.log(shouldOpenPromotionDialog);*/
    if(shouldOpenPromotionDialog){
      this.pieceSafeSquares = [];
      this.isPromotionActive = true; 
      this.promotionCoords = {x: newX, y: newY}
      return;
    }

    const {x: prevX,y:prevY} = this.selectedSquare;
    this.updateBoard(prevX,prevY,newX,newY,this.promotedPiece);
  }


  public move(x:number, y:number ){
    this.selectingPiece(x,y);
    this.placingPiece(x,y);
    //this.FENString.emit(this.chessBoard.boardAsFEN);
    //this.chessBoardService.loadScoreFromApi(this.chessBoard.boardAsFEN);
  }

  public isSquarelastMove(x: number, y:number): boolean{
    if(!this.lastMove) return false;
    const {prevX,prevY,currX,currY} = this.lastMove;
    return x === prevX && y=== prevY || x === currX && y === currY;
  }
  public isSquareChecked(x: number, y:number): boolean{
   
    return this.checkState.isInCheck && this.checkState.x === x && this.checkState.y === y;
  }

  private unmarkPreviusSelectedSafeSquares(): void{
    this.selectedSquare = {piece: null};
    this.pieceSafeSquares = [];
    if(this.isPromotionActive){
      this.isPromotionActive = false;
      this.promotedPiece = null;
      this.promotionCoords = null;
    }
  }
  protected updateBoard(prevX: number, prevY: number, newX: number, newY: number, promotedPiece: FENChar | null):void{
    this.chessBoard.move(prevX,prevY,newX,newY,this.promotedPiece);

    this.chessBoardView = this.chessBoard.chessBoardView;
    this.checkState = this.chessBoard.checkState;
    this.lastMove = this.chessBoard.lastMove;
    
    this.unmarkPreviusSelectedSafeSquares();
    this.chessBoardService.chessBoardState$.next(this.chessBoard.boardAsFEN);
    this.chessBoardService.loadScoreFromApi(this.chessBoard.boardAsFEN);
    
  }
  public promotePiece(piece: FENChar): void{
    if(!this.promotionCoords || !this.selectedSquare.piece)return;

    this.promotedPiece = piece;
    const {x: newX, y:newY} = this.promotionCoords;
    const {x:prevX,y:prevY} = this.selectedSquare;
    this.updateBoard(prevX,prevY,newX,newY,this.promotedPiece);
  }
  public closePawnPromotionDialog():void{
    this.unmarkPreviusSelectedSafeSquares();
  }
  public isSquarePromotionSquare(x:number,y:number): boolean{
    if(!this.promotionCoords) return false;
    return this.promotionCoords.x === x && this.promotionCoords.y === y;
  }
  public flipBoard():void{
    this.flipMode=!this.flipMode;
  }
}
