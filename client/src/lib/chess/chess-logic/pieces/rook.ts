
import { FENChar, Coords, Color } from "../models";
import { Piece } from "./piece";

export class Rook extends Piece{
    private _hasMoved: boolean = false;
    protected override _FENChar: FENChar;
    protected override _directions: Coords[] = [
        {x:1, y:0},
        {x:0, y:1},
        {x:-1, y:0},
        {x:0, y:-1}
    ];
    constructor(private pieceColor:Color){
        super(pieceColor);
        this._FENChar = pieceColor === Color.white ? FENChar.whiteRook: FENChar.blackRook;
    }

    public get hasMoved():boolean{
        return this._hasMoved;
    }
    public set hasMoved(_){
        this._hasMoved = true;
    }
}