import {Piece} from "../chessgame/pieces"

export class Chessgame {
    boardStatePieces: string[] = ['ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK',
      'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN',
      'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
      'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
      'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
      'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
      'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN',
      'ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK'];;
    boardStateColours: string[] = ['BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK',
      'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK',
      'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
      'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
      'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
      'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
      'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE',
      'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE'];

    constructor(){
       this.reset();
    }

    reset(){
        this.boardStatePieces = ['ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK',
            'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN',
            'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
            'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
            'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
            'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
            'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN',
            'ROOK', 'KNIGHT', 'BISHOP', 'QUEEN', 'KING', 'BISHOP', 'KNIGHT', 'ROOK'];
          this.boardStateColours = ['BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK',
            'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK', 'BLACK',
            'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
            'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
            'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
            'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY', 'EMPTY',
            'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE',
            'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE', 'WHITE']
    }

    movePiece(to:number, from: number){
      var piece = this.getpiece(from, this.boardStateColours[from]);
      var colour  = this.getPieceColour(from, this.boardStateColours[from])
      if (piece == 'empty') return false;
        switch(piece){
          case(Piece.pawn):{
            
            let  legalMoves: number[]  = this.getPawnMoves(from,colour);
            if(legalMoves.find((element) => element == to)){
              return legalMoves
            }
            break;
          }
          case(Piece.rook):{
            let  legalMoves: number[]  = this.getRookMoves(from,colour);
            if(legalMoves.find((element) => element == to)){
              return legalMoves
            }
            break;
          }
          case(Piece.knight):{
            let  legalMoves: number[]  = this.getKnightMoves(from,colour);
            if(legalMoves.find((element) => element == to)){
              return legalMoves
            }
            break;
          }
          case(Piece.bishop):{
            let  legalMoves: number[]  = this.getBishopMoves(from,colour);
            if(legalMoves.find((element) => element == to)){
              return legalMoves
            }
            break;
            
          }
          case(Piece.king):{
            let  legalMoves: number[]  = this.getKingMoves(from,colour);
            if(legalMoves.find((element) => element == to)){
              return legalMoves
            }
            break;
            
          }
          case(Piece.queen):{
            let  legalMoves: number[]  = this.getQueenMoves(from,colour);
            if(legalMoves.find((element) => element == to)){
              return legalMoves
            }
            break;
            
          }
        }
        return null
    }
    getPieceColour(location:number, colour:string){
      var colour  = this.boardStateColours[location];
      return colour
    }
    getpiece(location:number, colour:string){
      var piece  = this.boardStatePieces[location];
      return piece
    }
    getPawnMoves(current:number, colour:string){
      const Deltas = [-8,-7,-9];
      let legalMoves: Array<number> = [current];
      if(this.boardStatePieces[current+Deltas[1]] != 'EMPTY' && this.boardStateColours[current+Deltas[1]] != colour) legalMoves.push(current+Deltas[1]);
      if(this.boardStatePieces[current+Deltas[2]] != 'EMPTY' && this.boardStateColours[current+Deltas[1]] != colour) legalMoves.push(current+Deltas[2]);
      if(this.boardStatePieces[current+Deltas[0]] == 'EMPTY' ) legalMoves.push(current+Deltas[0]);
      
      return legalMoves;
    }
    getRookMoves(current:number, colour:string){
      const Deltas = [-1,-8,8,1];
      let legalMoves: Array<number> = [current];
      Deltas.forEach(function(delta){
        legalMoves.push(current+delta);
      });
      return legalMoves;
    }
    getKnightMoves(current:number, colour:string){
      const Deltas = [-15,-17,-6,-10,15,17,6,10];
      let legalMoves: Array<number> = [current];
      Deltas.forEach(function(delta){
        legalMoves.push(current+delta);
      });
      return legalMoves;
    }
    getBishopMoves(current:number, colour:string){
      const Deltas = [-7,-9,9,7];
      let legalMoves: Array<number> = [current];
      Deltas.forEach(function(delta){
        legalMoves.push(current+delta);
      });
      return legalMoves;
    }
    getQueenMoves(current:number, colour:string){
      const Deltas = [-7,-8,-9,-1,1,7,8,9];
      let legalMoves: Array<number> = [current];
      Deltas.forEach(function(delta){
        legalMoves.push(current+delta);
      });
      return legalMoves;
    }
    getKingMoves(current:number, colour:string){
      const Deltas = [-7,-8,-9,-1,1,7,8,9];
      let legalMoves: Array<number> = [current];
      Deltas.forEach(function(delta){
        legalMoves.push(current+delta);
      });
      return legalMoves;
    }
}

