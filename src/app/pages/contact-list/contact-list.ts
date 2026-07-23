import { Component, ViewChild } from '@angular/core';
import { Contacts } from '../../components/contacts/contacts';
import { ContacsButton } from '../../components/contacs-button/contacs-button';
import { ContactDetails } from '../../components/contact-details/contact-details';
import { Contact } from '../../models/contact.model'; 

/**
 * Manages the contact list view, details pane, and mobile detail view states.
 */
@Component({
  selector: 'app-contact-list',
  imports: [Contacts, ContacsButton, ContactDetails],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {
  @ViewChild(ContactDetails) detailsComponent?: ContactDetails;
  selectedContactId: number | null = null;
  isMobileDetailView = false;

  /**
   * Updates the selected contact ID and loads details into the detail view component.
   *
   * @param contact - The selected contact object.
   */
  onContactSelected(contact: Contact) {
    this.selectedContactId = Number(contact.id);
    this.detailsComponent?.loadDetails(this.selectedContactId);
  }

  /**
   * Toggles the visibility state of the mobile detail view and resets selection on close.
   *
   * @param isOpen - Flag indicating whether the mobile detail view is open.
   */
  onMobileDetailViewChange(isOpen: boolean) {
    this.isMobileDetailView = isOpen;

    if (!isOpen) {
      this.selectedContactId = null;
    }
  }
}
