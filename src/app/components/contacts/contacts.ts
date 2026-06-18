import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact, Supabase } from '../../supabase';
import { ContactForm } from '../contact-form/contact-form';
import { ContactDetails } from '../contact-details/contact-details'
import { first } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactForm],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {

  db = inject(Supabase);
  
  showContactForm = signal(false);

  openContactForm() {
    this.showContactForm.set(true);
  }

  closeContactForm() {
    this.showContactForm.set(false);
  }
  
  cd = inject(ContactDetails);

  groupedContacts = computed(() => {
    const groups = new Map<string, Contact[]>();

    for (const contact of this.db.contacts()) {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();

      if (!groups.has(firstLetter)) {
        groups.set(firstLetter, []);
      }

      groups.get(firstLetter)!.push(contact);
    }

    return Array.from(groups.entries());
  });

  getInitials(contact: any) {
    const firstNameLetter = contact.first_name.charAt(0).toUpperCase();
    const lastNameLetter = contact.last_name.charAt(0).toUpperCase();

    return firstNameLetter + lastNameLetter;
  }



  @Output() contactSelected = new EventEmitter<Contact>();

  openContactDetails(contact: Contact) {
    this.contactSelected.emit(contact);

    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement;
    detailsPopUp.classList.toggle('active')
    let contactID = Number(contact.id);
    this.cd.loadDetails(contactID);
  }
}
