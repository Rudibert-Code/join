import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Summery } from './summery';

describe('Summery', () => {
  let component: Summery;
  let fixture: ComponentFixture<Summery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Summery],
    }).compileComponents();

    fixture = TestBed.createComponent(Summery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
