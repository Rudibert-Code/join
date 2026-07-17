import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEdit } from './ticket-edit';

describe('TicketEdit', () => {
  let component: TicketEdit;
  let fixture: ComponentFixture<TicketEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
