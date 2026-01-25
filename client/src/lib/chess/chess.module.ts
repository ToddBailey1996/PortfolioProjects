import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChessboardComponent } from './board-component/board-component.component';
import { ComputerModeComponent } from './computer-mode/computer-mode.component';
import { ScoreBarComponent } from './score-bar/score-bar.component';
import { ChessHostComponent } from './chess-host/chess-host.component';

@NgModule({
  declarations: [
   
    
    
    // add other chess components here
  ],
  imports: [
    CommonModule,
    RouterModule, // keep RouterModule so child routing works if you add it
     ChessboardComponent,
     ScoreBarComponent,
     ChessHostComponent
  ],
  exports: [
    
     // export if you want to use it in other modules/templates
    
    ChessboardComponent,
    ScoreBarComponent,
     ChessHostComponent
  ]
})
export class ChessModule {}