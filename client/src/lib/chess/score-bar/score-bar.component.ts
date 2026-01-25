import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'score-bar',
  standalone: true,
  templateUrl: './score-bar.component.html',
  styleUrls: ['./score-bar.component.css']
})
export class ScoreBarComponent {
  @Input() value: number = 50;

  @Input() color1: string = '#4CAF50';  // left color
  @Input() color2: string = '#F44336';  // right color
}
