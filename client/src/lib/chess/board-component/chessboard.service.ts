import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FENConverter } from '../chess-logic/FENConverter';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChessboardService {

  public chessBoardState$ = new BehaviorSubject<string>(FENConverter.initalPosition);
private readonly engine: string = environment.chessApiBase;
  public score$ = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  
  
public loadScoreFromApi(fen:string){
    const queryParams: BestMoveParams = {
      fen: fen,
    }
    //let params = new HttpParams().appendAll(queryParams);
    return this.http.post<any>(this.engine + '/api/neuralNetwork/BoardScore', 
      {FEN: fen},
      { headers: { 'Content-Type': 'application/json' } }
    )
      .subscribe(score => {
        this.score$.next(score); // adjust to match your API
      });
  }

}
export type BestMoveParams = {
    fen: string;
}