import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessHostComponent } from './chess-host.component';

describe('ChessHostComponent', () => {
  let component: ChessHostComponent;
  let fixture: ComponentFixture<ChessHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessHostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChessHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
