import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuPopup } from './submenu-popup';

describe('SubmenuPopup', () => {
  let component: SubmenuPopup;
  let fixture: ComponentFixture<SubmenuPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmenuPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmenuPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
