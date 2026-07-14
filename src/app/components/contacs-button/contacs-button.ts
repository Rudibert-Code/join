import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { ContactForm } from '../contact-form/contact-form';
import { EditContactModal } from '../edit-contact-modal/edit-contact-modal';
import { Supabase } from '../../supabase';

@Component({
  selector: 'app-contacs-button',
  standalone: true,
  imports: [CommonModule, ContactForm, EditContactModal],
  templateUrl: './contacs-button.html',
  styleUrl: './contacs-button.scss',
})
export class ContacsButton {
  
  db = inject(Supabase);

  showContactForm = signal(false);
  showEditModal = signal(false);

  openContactForm() {
    let btnIMG = document.getElementById('contact-button_img') as HTMLImageElement;
    let btnState = String(btnIMG.src);
   if (btnState.includes('assets/UI/vector/icon_add-user.svg')) {
     this.showContactForm.set(true);
   } else if (btnState.includes('assets/UI/vector/icon_edit-user.svg')){
     this.showEditModal.set(true);
   }
  }

  closeContactForm() {
    this.showContactForm.set(false);
  }
  closeEditModal() {
    this.showEditModal.set(false);
  }
}
