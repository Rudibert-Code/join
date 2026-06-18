import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactModal } from './edit-contact-modal';

describe('EditContactModal', () => {
  let component: EditContactModal;
  let fixture: ComponentFixture<EditContactModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContactModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditContactModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
