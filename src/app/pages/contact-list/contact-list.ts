import { Component } from '@angular/core';
import { Contacts } from '../../components/contacts/contacts';
import { ContacsButton } from '../../components/contacs-button/contacs-button';
import { App } from "../../app";

import { ContactDetails } from '../../components/contact-details/contact-details'

@Component({
  selector: 'app-contact-list',
  imports: [Contacts,ContacsButton,ContactDetails],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {}
