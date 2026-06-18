import { Component,ViewChild } from '@angular/core';
import { Contacts } from '../../components/contacts/contacts';
import { ContacsButton } from '../../components/contacs-button/contacs-button';
import { App } from "../../app";

import { ContactDetails } from '../../components/contact-details/contact-details'
import { Contact } from '../../supabase';

@Component({
  selector: 'app-contact-links-mobile-details',
  imports: [Contacts,ContacsButton,ContactDetails],
  templateUrl: './contact-links-mobile-details.html',
  styleUrl: './contact-links-mobile-details.scss',
})
export class ContactLinksMobileDetails {
  @ViewChild(ContactDetails) detailsComponent?: ContactDetails;
  
  onContactSelected(contact: Contact) {
    this.detailsComponent?.loadDetails(Number(contact.id));
  }
}
