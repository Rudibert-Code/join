import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { ContactForm } from '../contact-form/contact-form';
import { EditContactModal } from '../edit-contact-modal/edit-contact-modal';

/**
 * Reusable action button component that triggers either the new contact creation modal
 * or the edit contact modal based on mode.
 */
@Component({
  selector: 'app-contacs-button',
  standalone: true,
  imports: [CommonModule, ContactForm, EditContactModal],
  templateUrl: './contacs-button.html',
  styleUrl: './contacs-button.scss',
})
export class ContacsButton {
  /** Optional ID of the target contact to edit when operating in edit mode. */
  @Input() contactId: number | null = null;

  /** Controls whether button action triggers edit mode or new contact creation. */
  @Input() isEditMode = false;

  /** Signal state tracking visibility of the new contact form modal. */
  showContactForm = signal(false);

  /** Signal state tracking visibility of the edit contact modal. */
  showEditModal = signal(false);

  /**
   * Evaluates component mode and opens either the edit modal or new contact form.
   */
  openContactForm() {
    if (this.isEditMode) {
      if (this.contactId !== null) {
        this.showEditModal.set(true);
      }
      return;
    }

    this.showContactForm.set(true);
  }

  /**
   * Closes the new contact creation form overlay.
   */
  closeContactForm() {
    this.showContactForm.set(false);
  }

  /**
   * Closes the edit contact modal dialog.
   */
  closeEditModal() {
    this.showEditModal.set(false);
  }
}
