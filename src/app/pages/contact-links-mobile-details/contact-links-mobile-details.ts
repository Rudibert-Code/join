import { Component, ViewChild } from '@angular/core';
import { ContacsButton } from '../../components/contacs-button/contacs-button';
import { ContactDetails } from '../../components/contact-details/contact-details';
import { Contact } from '../../supabase';

/**
 * Handles mobile contact list action buttons and triggers details loading.
 */
@Component({
  selector: 'app-contact-links-mobile-details',
  imports: [ContacsButton, ContactDetails],
  templateUrl: './contact-links-mobile-details.html',
  styleUrl: './contact-links-mobile-details.scss',
})

export class ContactLinksMobileDetails {
  @ViewChild(ContactDetails) detailsComponent?: ContactDetails;

  /**
   * Loads contact details into the mobile detail view when a contact is selected.
   *
   * @param contact - The selected contact object.
   */
  onContactSelected(contact: Contact) {
    this.detailsComponent?.loadDetails(Number(contact.id));
  }
}
