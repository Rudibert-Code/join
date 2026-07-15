import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { ContactForm } from '../contact-form/contact-form';
import { EditContactModal } from '../edit-contact-modal/edit-contact-modal';

@Component({
  selector: 'app-contacs-button',
  standalone: true,
  imports: [CommonModule, ContactForm, EditContactModal],
  templateUrl: './contacs-button.html',
  styleUrl: './contacs-button.scss',
})
export class ContacsButton {
  @Input() contactId: number | null = null;
  @Input() isEditMode = false;

  showContactForm = signal(false);
  showEditModal = signal(false);

  openContactForm() {
    if (this.isEditMode) {
      if (this.contactId !== null) {
        this.showEditModal.set(true);
      }
      return;
    }

    this.showContactForm.set(true);
  }

  closeContactForm() {
    this.showContactForm.set(false);
  }
  closeEditModal() {
    this.showEditModal.set(false);
  }
}
