import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactLinksMobileDetails } from './contact-links-mobile-details';

describe('ContactLinksMobileDetails', () => {
  let component: ContactLinksMobileDetails;
  let fixture: ComponentFixture<ContactLinksMobileDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactLinksMobileDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactLinksMobileDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
