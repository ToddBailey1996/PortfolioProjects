import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBarComponent } from './score-bar.component';

describe('ScoreBarComponent', () => {
  let component: ScoreBarComponent;
  let fixture: ComponentFixture<ScoreBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreBarComponent]
    });
    fixture = TestBed.createComponent(ScoreBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
