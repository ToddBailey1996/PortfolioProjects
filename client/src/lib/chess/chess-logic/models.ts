import { Piece } from "./pieces/piece";

export enum Color{
    white,
    black
}

export type Coords = {
    x:number;
    y:number;
}

export enum FENChar{
    whitePawn="P",
    whiteKnight="N",
    whiteRook="R",
    whiteBishop="B",
    whiteKing="K",
    whiteQueen="Q",
    blackPawn="p",
    blackKnight="n",
    blackRook="r",
    blackBishop="b",
    blackKing="k",
    blackQueen="q",
}

export const pieceImagePaths: Readonly<Record<FENChar,string>> = {
    [FENChar.whitePawn]: "assets/Chess_plt60.png",
    [FENChar.whiteKnight]: "assets/Chess_nlt60.png",
    [FENChar.whiteRook]: "assets/Chess_rlt60.png",
    [FENChar.whiteBishop]: "assets/Chess_blt60.png",
    [FENChar.whiteKing]: "assets/Chess_klt60.png",
    [FENChar.whiteQueen]: "assets/Chess_qlt60.png",
    [FENChar.blackPawn]: "assets/Chess_pdt60.png",
    [FENChar.blackKnight]: "assets/Chess_ndt60.png",
    [FENChar.blackRook]: "assets/Chess_rdt60.png",
    [FENChar.blackBishop]: "assets/Chess_bdt60.png",
    [FENChar.blackKing]: "assets/Chess_kdt60.png",
    [FENChar.blackQueen]: "assets/Chess_qdt60.png"
}

export type SafeSquares = Map<string,Coords[]>;

type SquareWithPiece = {

    piece:FENChar;
    x: number;
    y:number;
}

type SquareWithoutPiece = {
    piece:null;
}

export type SelectedSquare = SquareWithPiece | SquareWithoutPiece

export type LastMove = {
    prevX: number;
    prevY: number;
    piece: Piece;
    currX: number;
    currY: number
}

type kingChecked = {
    isInCheck: true;
    x: number;
    y: number;
}

type kingNotChecked = {
    isInCheck: false;
}
export type CheckState = kingChecked| kingNotChecked;

export const columns = ["a", "b" ,"c", "d" ,"e", "f","g", "h"];