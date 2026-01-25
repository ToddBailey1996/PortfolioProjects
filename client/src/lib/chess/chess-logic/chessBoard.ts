import { FENConverter } from "./FENConverter";
import { CheckState, Color, Coords, FENChar, LastMove, SafeSquares } from "./models";
import { Bishop } from "./pieces/Bishop";
import { King } from "./pieces/king";
import { Knight } from "./pieces/knight";
import { Pawn } from "./pieces/pawn";
import { Piece } from "./pieces/piece";
import { Queen } from "./pieces/queen";
import { Rook } from "./pieces/rook";

export class ChessBoard{
    private chessBoard:(Piece|null)[][];
    private readonly chessBoardSize: number = 8
    private _playerColor = Color.white;
    private _safeSquares: SafeSquares;
    private _lastMove: LastMove | undefined;
    private _checkState: CheckState = {isInCheck: false};
    private _isGameOver : boolean = false;
    private _gameOverMessage : string|undefined;
    private fiftyMoveRuleCounter: number = 0;
    private threeFoldRepetitionDictionary = new Map<string, number>();
    private threeFoldRepetitionFlag: boolean = false;
    private fullNumberOfMoves: number = 1;
    private _boardAsFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    private FENConverter = new FENConverter();

    constructor(){
    
        this.chessBoard = [
            [
                new Rook(Color.white),new Knight(Color.white), new Bishop(Color.white), new Queen(Color.white),
                new King(Color.white), new Bishop(Color.white), new Knight(Color.white), new Rook(Color.white)
            ],
            [
                new Pawn(Color.white),new Pawn(Color.white),new Pawn(Color.white),new Pawn(Color.white),
                new Pawn(Color.white),new Pawn(Color.white),new Pawn(Color.white),new Pawn(Color.white)
            ],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [
                new Pawn(Color.black),new Pawn(Color.black),new Pawn(Color.black),new Pawn(Color.black),
                new Pawn(Color.black),new Pawn(Color.black),new Pawn(Color.black),new Pawn(Color.black)
            ],
            [
                new Rook(Color.black),new Knight(Color.black), new Bishop(Color.black), new Queen(Color.black),
                new King(Color.black), new Bishop(Color.black), new Knight(Color.black), new Rook(Color.black)
            ],
        ];
        this._safeSquares = this.findSafeSquares();
    }
    public get playerColor(): Color{
        return this._playerColor;
    }
    public get chessBoardView():(FENChar|null)[][]{
        return this.chessBoard.map(row =>{
            return row.map(piece => piece instanceof Piece ? piece.FENChar: null);
        })
    }
    public get boardAsFEN():string{
        return this._boardAsFEN;
    }
    public get safeSquares(): SafeSquares{
        return this._safeSquares;
    }

    public static isSquareDark(x:number, y:number):boolean{
        return x % 2 === 0 && y % 2 ===0 || x % 2 === 1 && y % 2 === 1;
    }
    private  CoordsValid(x:number, y:number): boolean{
        return x >= 0 && y>= 0 && x < this.chessBoardSize && y < this.chessBoardSize;
    }
    public isInCheck(playerColor: Color, checkingCurrentPosition: boolean){
        for(let x = 0; x < this.chessBoardSize; x++){
            for(let y = 0; y<this.chessBoardSize;y++){
                const piece: Piece|null = this.chessBoard[x][y];
                if(!piece || piece.color === playerColor) continue;

                for(const {x: dx, y: dy} of piece.directions){
                    let newX: number = x+dx;
                    let newY: number = y+dy;    
                    
                    if(!this.CoordsValid(newX,newY)) continue;

                    if(piece instanceof Pawn || piece instanceof Knight || piece instanceof King){
                        if(piece instanceof Pawn && dy === 0) continue;
                        const attackedPiece: Piece|null = this.chessBoard[newX][newY];
                        if(attackedPiece instanceof King && attackedPiece.color === playerColor){
                            if(checkingCurrentPosition) this._checkState = {isInCheck: true, x: newX, y:newY};
                            return true;
                        }
                    }
                    else{
                        while (this.CoordsValid(newX,newY)){
                            const attackedPiece: Piece|null = this.chessBoard[newX][newY];
                            if(attackedPiece instanceof King && attackedPiece.color === playerColor){
                                if(checkingCurrentPosition) this._checkState = {isInCheck: true, x: newX, y:newY};
                                return true;
                            }

                            if(attackedPiece !== null)break;

                            newX += dx;
                            newY += dy
                        }
                    }
                }
            }
        }
        if(checkingCurrentPosition) this._checkState = {isInCheck: false};
        return false;
    }
    private isPositionSafeAfterMove(prevX:number,prevY:number, newX:number, newY:number){
        const piece:Piece|null = this.chessBoard[prevX][prevY];
        if(!piece) return false;


        const newPiece:Piece|null = this.chessBoard[newX][newY];
        if(newPiece && newPiece.color === piece.color) return false;

        //simulate position
        this.chessBoard[prevX][prevY] = null;
        this.chessBoard[newX][newY] = piece;

        const isPositionSafe: boolean = !this.isInCheck(piece.color,false);
        this.chessBoard[prevX][prevY] = piece;
        this.chessBoard[newX][newY] = newPiece;

        return isPositionSafe;
    }

    public get lastMove(): LastMove| undefined{
        return this._lastMove;
    }

    private findSafeSquares():SafeSquares{
        const safeSquares: SafeSquares = new Map<string,Coords[]>();
        for(let x = 0; x < this.chessBoardSize; x++){
            for(let y = 0; y<this.chessBoardSize;y++){
                const piece: Piece|null = this.chessBoard[x][y];
                if(!piece|| piece.color !== this._playerColor) continue
                const pieceSafeSquare: Coords[] = [];
                for(const {x: dx, y: dy} of piece.directions){
                    
                    let newX: number = x+dx;
                    let newY: number = y+dy;
                    if(x === 1 && y === 3){
                       console.log(x +"," + y);
                        //console.log(newX +"," + newY);
                    }
                    if(!this.CoordsValid(newX,newY)) continue;
                    let newPiece: Piece|null = this.chessBoard[newX][newY];
                    if(newPiece && newPiece.color === piece.color)continue;


                    //restrict pawn movement
                    if(piece instanceof Pawn){
                        //cant move pawns two squares straight if there is piece in front of it.
                        if(dx ===2|| dx ===-2){
                            if(newPiece) continue;
                            if(this.chessBoard[newX + (dx ===2 ? -1:1)][newY]) continue;
                        }
                        //cant move pawn one square striaght if piece is in front of him
                        if((dx ===1 || dx === -1) && dy === 0 && newPiece) continue;
                        //cant move pawn diagonally if there is no piece, or piece has the same colour as pawn
                        if((dy === 1 || dy === -1) && (!newPiece || piece.color === newPiece.color)) continue;
                    }
                    if(piece instanceof Pawn || piece instanceof Knight || piece instanceof King){
                        if(this.isPositionSafeAfterMove(x,y,newX,newY)){
                            pieceSafeSquare.push({x: newX, y:newY})
                        }
                        
                    }
                    else{
                        while(this.CoordsValid(newX,newY)){
                            newPiece = this.chessBoard[newX][newY];
                            if(newPiece && newPiece.color === piece.color) break;

                            if(this.isPositionSafeAfterMove(x,y,newX,newY)){
                                pieceSafeSquare.push({x: newX, y:newY})
                            }
                            if(newPiece !== null) break;
                            newX += dx;
                            newY += dy
                            
                        }
                    }
                }
                if(piece instanceof King){
                    if(this.canCastle(piece,true))
                    {
                        pieceSafeSquare.push({x,y:6});
                    }
                    if(this.canCastle(piece,false)){
                        pieceSafeSquare.push({x,y:2})
                    }
                }
                else if(piece instanceof Pawn && this.canCaptureEnPassant(piece,x,y)){
                    pieceSafeSquare.push({x: x + (piece.color === Color.white ? 1:-1),y: this._lastMove!.prevY});
                }

                if(pieceSafeSquare.length){
                    safeSquares.set(x + "," + y,pieceSafeSquare);
                }
                
            }
        }
        console.log(safeSquares);
        return safeSquares;
    }

    public get checkState(): CheckState {
        return this._checkState;
    }
    private canCaptureEnPassant(pawn: Pawn, pawnX: number, pawnY: number): boolean{
        if(!this._lastMove) return false;
        const {piece,prevX,prevY,currX,currY} = this._lastMove;

        if(
            !(piece instanceof Pawn) ||
            pawn.color !== this._playerColor ||
            Math.abs(currX - prevX) !== 2 ||
            pawnX !== currX ||
            Math.abs(pawnY - currY) !== 1
        )return false

        const pawnNewPositionX: number = pawnX + (pawn.color === Color.white ? 1 : -1);
        const pawnNewPositionY: number = currY;

        this.chessBoard[currX][currY] = null;
        const isPositionSafe: boolean = this.isPositionSafeAfterMove(pawnX,pawnY, pawnNewPositionX,pawnNewPositionY);
        this.chessBoard[currX][currY] = piece;
        return isPositionSafe;
    }
    private canCastle(king:King,kingSideCastle:boolean):boolean{
        if(king.hasMoved)return false;
        const kingPositionX : number = king.color === Color.white ? 0 : 7;
        const kingPositionY : number = 4;

        const rookPositionX : number = kingPositionX;
        const rookPositionY : number = kingSideCastle ? 7 : 0;
        const rook: Piece|null = this.chessBoard[rookPositionX][rookPositionY]
        if(!(rook instanceof Rook) || rook.hasMoved || this._checkState.isInCheck) return false;

        const firstNextKingPositionY: number = kingPositionY + (kingSideCastle ? 1 : -1);
        const secondNextKingPositionY: number = kingPositionY + (kingSideCastle ? 2 : -2);

        if(this.chessBoard[kingPositionX][firstNextKingPositionY] || this.chessBoard[kingPositionX][secondNextKingPositionY]) return false;

        if(!kingSideCastle && this.chessBoard[kingPositionX][1]) return false;

        return this.isPositionSafeAfterMove(kingPositionX,kingPositionY,kingPositionX,firstNextKingPositionY) && 
        this.isPositionSafeAfterMove(kingPositionX,kingPositionY,kingPositionX,secondNextKingPositionY)
    }
    public move(prevX:number,prevY:number, newX:number,newY:number,promotedPieceType: FENChar|null ):void{

        if(this._isGameOver) throw Error("Game is over, you can't play a move.")
        
        if(!this.CoordsValid(prevX,prevY) || !this.CoordsValid(newX,newY)) return;
        const piece: Piece|null = this.chessBoard[prevX][prevY];
        if(!piece || piece.color !== this._playerColor) return;
        const pieceSafeSquares : Coords[]|undefined = this._safeSquares.get(prevX + "," + prevY);

        if(!pieceSafeSquares|| !pieceSafeSquares.find(coords => coords.x === newX && coords.y === newY)){
            throw new Error("Square is not safe");
        }

        if((piece instanceof Pawn || piece instanceof King || piece instanceof Rook) && !piece.hasMoved){
            piece.hasMoved = true;
        }
        const isPieeceTaken:boolean = this.chessBoard[newX][newY] !== null;
        if(piece instanceof Pawn || isPieeceTaken) {
            this.fiftyMoveRuleCounter = 0;
        }
        else{
            this.fiftyMoveRuleCounter += 0.5;
        }
        this.handleSpecialMoves(piece,prevX,prevY, newX, newY);

        if(promotedPieceType){
            this.chessBoard[newX][newY] = this.promotedPiece(promotedPieceType);

        }else{
            this.chessBoard[newX][newY] = piece;
        }
        this.chessBoard[prevX][prevY] = null;
       
        this._lastMove = {prevX,prevY,currX:newX,currY:newY, piece};
        this._playerColor = this._playerColor === Color.white ? Color.black : Color.white;
        this.isInCheck(this._playerColor,true);
        this._safeSquares = this.findSafeSquares();

        if(this._playerColor === Color.white){
            this.fullNumberOfMoves++;
        }
        this._boardAsFEN = this.FENConverter.convertBoardToFen(this.chessBoard, this._playerColor,this._lastMove,this.fiftyMoveRuleCounter,this.fullNumberOfMoves);
        this.updateThreeFoldRepetitionDictionary(this._boardAsFEN);
        this._isGameOver = this.isGameFinished();

    }

    private handleSpecialMoves(piece:Piece, prevX: number, prevY: number, newX: number, newY : number): void{
        if(piece instanceof King && Math.abs(newY - prevY) === 2){
            // kingside castle

            const rookPositionX: number = prevX;
            const rookPositionY: number = newY > prevY ? 7 : 0;

            const rook = this.chessBoard[rookPositionX][rookPositionY] as Rook;
            const rookNewPositionY: number = newY > prevY ? 5 : 3;
            this.chessBoard[rookPositionX][rookPositionY] = null;
            this.chessBoard[rookPositionX][rookNewPositionY] = rook;
            rook.hasMoved = true;
        }
        else if(
            piece instanceof Pawn && 
            this._lastMove && 
            this._lastMove.piece instanceof Pawn &&
            Math.abs(this._lastMove.currX - this._lastMove.prevX) === 2 &&
            prevX === this._lastMove.currX &&
            newY === this._lastMove.currY
        ){
            this.chessBoard[this._lastMove.currX][this._lastMove.currY] = null;
        }
    }

    private promotedPiece(promotedPieceType: FENChar) : Knight|Bishop|Rook|Queen{
        if(promotedPieceType === FENChar.whiteKnight || promotedPieceType === FENChar.blackKnight){
            return new Knight(this._playerColor);
        }
        if(promotedPieceType === FENChar.whiteBishop || promotedPieceType === FENChar.blackBishop){
            return new Bishop(this._playerColor);
        }
        if(promotedPieceType === FENChar.whiteRook || promotedPieceType === FENChar.blackRook){
            return new Rook(this._playerColor);
        }
        return new Queen(this._playerColor);
        
    }

    public get gameOverMessage():string|undefined{
        return this._gameOverMessage;
    }
    public get isGameOver() : boolean{
        return this._isGameOver;
    }   

    private isGameFinished():boolean{
        if(!this._safeSquares.size){
            if(this._checkState.isInCheck){
                const prevPlayer: string = this._playerColor === Color.white ? "Black" : "White";
                this._gameOverMessage = prevPlayer + " won by checkmate";
            }
            else{
                this._gameOverMessage = "Stalemate";
            }
            return true;
        }
        if(this.threeFoldRepetitionFlag){
            this._gameOverMessage = "Draw due to three fold repetition rule";
        }
        if(this.fiftyMoveRuleCounter == 50){
            this._gameOverMessage = "Draw due to fifty move rule";
            return true;
        }
        return false;
    }

    private updateThreeFoldRepetitionDictionary(FEN:string): void{
        const threeFoldRepetitionFENKey: string = FEN.split(" ").slice(0,4).join("");
        const threeFoldRepetitionValue: number | undefined = this.threeFoldRepetitionDictionary.get(threeFoldRepetitionFENKey);

        if(threeFoldRepetitionValue === undefined){
            this.threeFoldRepetitionDictionary.set(threeFoldRepetitionFENKey,1);
        }
        else{
            if(threeFoldRepetitionValue === 2){
                this.threeFoldRepetitionFlag = true;
                return;
            }
            this.threeFoldRepetitionDictionary.set(threeFoldRepetitionFENKey,2);
        }
    }
}