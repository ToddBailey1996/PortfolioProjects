import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ChessMove, MyChessAIQueryParams, MyChessAIResponse} from './models';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FENChar } from '../chess-logic/models';

@Injectable({
  providedIn: 'root'
})
export class MychessAIService {

  private readonly engine: string = "https://chessengine-e2hhe2gcajgpgahs.westeurope-01.azurewebsites.net/api/engine";
  
  constructor(private http: HttpClient) { }

  private convertColumnLetterToYCoord(string:string) : number{
    return string.charCodeAt(0) - "a".charCodeAt(0);
  }
  private promotedPiece(piece: string | undefined): FENChar|null{
    if(!piece) return null;
    if(piece === "n") return  FENChar.blackKnight;
    if(piece === "b") return  FENChar.blackBishop;
    if(piece === "r") return  FENChar.blackRook;
    return  FENChar.blackQueen;
  }


  private moveFromString(move:string): ChessMove{
    const prevY: number = this.convertColumnLetterToYCoord(move[0]);
    const prevX: number = Number(move[1]) - 1;
    const newY: number  = this.convertColumnLetterToYCoord(move[2]);
    const newX : number = Number(move[3]) - 1;
    const promotedPiece = this.promotedPiece(move[4]);

    return {prevX,prevY,newX, newY, promotedPiece};
  }

  public getBestMove(fen:string):Observable<ChessMove>{
    const queryParams: MyChessAIQueryParams = {
      fen: fen,
      depth: 2
    }
    //let params = new HttpParams().appendAll(queryParams);
    return this.http.post<MyChessAIResponse>(this.engine + '/BestMove',queryParams).pipe(
      switchMap(response => {
        const bestmove: string = response.data.split(" ")[1];
        return of(this.moveFromString(bestmove));
      })
    )
  }
    public createGame(): Observable<string> {
    return this.http.post<string>(this.engine + '/CreateGame', {});

  }
}
