import { Component, Input } from '@angular/core';
import { AsyncPipe,CommonModule } from '@angular/common';
import { ChessboardService } from '../board-component/chessboard.service';
@Component({
  selector: 'score-bar',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './score-bar.component.html',
  styleUrls: ['./score-bar.component.css']
})
export class ScoreBarComponent {

  constructor(public chessBoardService: ChessboardService) { }
  score$ = this.chessBoardService.score$;
 // @Input() value: number = 50;

  @Input() color1: string = '#4CAF50';  // left color
  @Input() color2: string = '#F44336';  // right color

  getLeftWidth(value: number) {
  const v = Math.max(-100, Math.min(100,value));
  return 50 - (v / 2);
}

getRightWidth(value: number) {
  const v = Math.max(-100, Math.min(100, value));
  return 50 + (v / 2);
}
}
