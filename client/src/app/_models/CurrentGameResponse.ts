import { GameMove } from "../chess/chess-logic/models";

export interface CurrentGameResponse {
  id: string;
  userId: string;
  gameId: string;
  fen: string;
  moves: GameMove[];
  savedAt: string;
}