import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FENConverter } from '../chess-logic/FENConverter';

@Injectable({
  providedIn: 'root'
})
export class ChessboardService {

  public chessBoardState$ = new BehaviorSubject<string>(FENConverter.initalPosition);

  public score$ = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}

  loadScoreFromApi(fen:string) {
    return this.http.get<any>('https://chessengine-e2hhe2gcajgpgahs.westeurope-01.azurewebsites.net/api/neuralNetwork/BoardScore')
      .subscribe(response => {
        this.score$.next(response.value); // adjust to match your API
      });
  }
  


}
