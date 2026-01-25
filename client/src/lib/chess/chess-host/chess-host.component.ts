import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessboardComponent } from '../board-component/board-component.component';
import { ComputerModeComponent } from '../computer-mode/computer-mode.component';
//import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';

@Component({
  selector: 'app-chess-host',
  standalone: true,
  // include both standalone child components here so Angular can create them
  imports: [CommonModule,ChessboardComponent, ComputerModeComponent,ReactiveFormsModule,],
  templateUrl: './chess-host.component.html',
})
export class ChessHostComponent {
  // expose the Types as public properties so the template can reference them
  public chessComp: Type<any> = ChessboardComponent;
  public computerComp: Type<any> = ComputerModeComponent;
  public depth: number = 2;
  public player: string  = 'human';
  public showForm = true;
  form = this.fb.nonNullable.group({
    player: ['human', Validators.required],
    searchDepth: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  // current component to render
  public current!: Type<any>;

  componentMap: Record<string, Type<any>> = {
    human: ChessboardComponent,
    computer: ComputerModeComponent,
  };

  constructor(private fb: FormBuilder) {
    this.current = this.componentMap['human'];

    this.form.get('player')!.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(value => {
      this.current = this.componentMap[value ?? 'human'];
    });

  }

  use(comp: Type<any>) {
    this.current = comp;
  }

  submit() {
      if (this.form.valid) {
    const player = this.form.value.player;

    this.current =
      player === 'computer'
        ? this.computerComp
        : this.chessComp;

    this.showForm = false; // ✅ hide form, show board
  }
  }
}