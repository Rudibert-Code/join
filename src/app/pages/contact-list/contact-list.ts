import { Component,ViewChild } from '@angular/core';
import { Contacts } from '../../components/contacts/contacts';
import { ContacsButton } from '../../components/contacs-button/contacs-button';
import { App } from "../../app";

import { ContactDetails } from '../../components/contact-details/contact-details'
import { Contact } from '../../supabase';

@Component({
  selector: 'app-contact-list',
  imports: [Contacts,ContacsButton,ContactDetails],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {
  @ViewChild(ContactDetails) detailsComponent?: ContactDetails;
  selectedContactId: number | null = null;
  isMobileDetailView = false;
  
  onContactSelected(contact: Contact) {
    this.selectedContactId = Number(contact.id);
    this.detailsComponent?.loadDetails(this.selectedContactId);
  }

  onMobileDetailViewChange(isOpen: boolean) {
    this.isMobileDetailView = isOpen;

    if (!isOpen) {
      this.selectedContactId = null;
    }
  }
}
