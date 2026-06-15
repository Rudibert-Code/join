import { Component, inject } from '@angular/core';
import { Contacts } from '../contacts/contacts'


@Component({
  selector: 'app-contacs-button',
  imports: [],
  templateUrl: './contacs-button.html',
  styleUrl: './contacs-button.scss',
})
export class ContacsButton {
   contactsService = inject(Contacts);

   assignNames(){
    this.contactsService.sortNames
   }
}
