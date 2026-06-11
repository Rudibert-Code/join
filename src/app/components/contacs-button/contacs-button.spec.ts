import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContacsButton } from './contacs-button';

describe('ContacsButton', () => {
  let component: ContacsButton;
  let fixture: ComponentFixture<ContacsButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContacsButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ContacsButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
