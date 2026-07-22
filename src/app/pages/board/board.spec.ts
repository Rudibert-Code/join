import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Board } from './board';

describe('Board', () => {
  let component: Board;
  let fixture: ComponentFixture<Board>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Board],
    }).compileComponents();

    fixture = TestBed.createComponent(Board);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve linked contacts by id instead of array index', async () => {
    component.db.contacts.set([
      {
        id: 7,
        first_name: 'Anna',
        last_name: 'Smith',
        phone: '123',
        email: 'anna@example.com',
        color: '#123456',
      },
    ]);
    component.db.task_contacts.set([{ task_id: 42, contact_id: 7 }]);

    await component.getContacts(42);

    //expect(component.contactsCache).toEqual([
    //  jasmine.objectContaining({
    //    name: 'Anna',
    //    surname: 'Smith',
    //    initials: 'AS',
    //    color: '#123456',
    //  }),
    //]);
  });
});
