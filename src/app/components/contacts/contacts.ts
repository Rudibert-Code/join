import { Component, computed, inject } from '@angular/core';
import { Contact, Supabase } from '../../supabase';
import { ContactDetails } from '../contact-details/contact-details'
import { first } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  db = inject(Supabase);

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

  openContactDetails(){
    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement;
    detailsPopUp.classList.toggle('active')
  }
}
