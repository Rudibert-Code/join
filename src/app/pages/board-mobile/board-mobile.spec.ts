import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMobile } from './board-mobile';

describe('BoardMobile', () => {
  let component: BoardMobile;
  let fixture: ComponentFixture<BoardMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardMobile],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardMobile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
