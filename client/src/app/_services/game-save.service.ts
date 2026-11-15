import { Injectable } from '@angular/core';
import { GameMove } from '../chess/chess-logic/models';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CurrentGameResponse } from '../_models/CurrentGameResponse';
export interface SavedGame {
  gameId: string;
  fen: string;
  moves: readonly GameMove[];
  savedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameSaveService {
  private readonly storageKey = 'chess-saved-game';
  private currentGame: SavedGame | null = null;
 baseUrl = environment.apiBaseUrl + '/api/';

 constructor(private http: HttpClient) {}
  /** Called by the active board whenever its position changes. */
  updateCurrentGame(fen: string, moves: readonly GameMove[]): void {
    this.currentGame = {
      gameId: this.currentGame?.gameId ?? crypto.randomUUID(),
      fen,
      moves: [...moves],
      savedAt: new Date().toISOString(),
    };
  }

  /** Save or update the latest game snapshot on the API. */
  saveCurrentGame(): Observable<CurrentGameResponse> {
  if (!this.currentGame) {
    return throwError(() => new Error('No current game to save'));
  }

   return this.http.post<CurrentGameResponse>(
    this.baseUrl + 'chess',
    this.currentGame
  );
}

  /** Retrieve the last saved game, or null if there isn't one. */
  loadSavedGame(): SavedGame | null {
    const saved = localStorage.getItem(this.storageKey);

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved) as SavedGame;
    } catch {
      return null;
    }
  }

  clearSavedGame(): void {
    localStorage.removeItem(this.storageKey);
  }
}
