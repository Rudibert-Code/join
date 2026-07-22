import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supabase } from '../../supabase';

/**
 * Dialog modal component for editing existing contact details or removing contacts.
 */
@Component({
  selector: 'app-edit-contact-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-contact-modal.html',
  styleUrl: './edit-contact-modal.scss',
})
export class EditContactModal {
  /** Regular expression pattern used for strict email format validation. */
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  /** Supabase service instance for contact CRUD operations. */
  contacts = inject(Supabase);

  /** Hex color assigned to contact avatar. */
  avatarColor: string = '';

  /** First name initial derived from fetched contact data. */
  initalFirstname: string = '';

  /** Last name initial derived from fetched contact data. */
  initalLastname: string = '';

  /** State flag controlling close animation SCSS classes. */
  isClosing = false;

  /** Database ID of the contact being edited. */
  @Input() contactId!: number;

  /** Event emitted when modal requests closing. */
  @Output() close = new EventEmitter<void>();

  /** Timer handle for fallback close animation timeout. */
  private animationCloseTimer?: number;

  /** Fallback timeout duration in milliseconds matching SCSS animation speed. */
  private readonly animationDuration = 250;

  /**
   * Fetches target contact details on initialization and populates avatar state and form controls.
   */
  async ngOnInit() {
    const contact = await this.contacts.getContactById(this.contactId);
    this.avatarColor = contact.color;
    this.initalFirstname = contact.first_name.charAt(0).toUpperCase();
    this.initalLastname = contact.last_name.charAt(0).toUpperCase();

    this.editContactForm.patchValue({
      firstname: contact.first_name,
      lastname: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    });
  }

  /** Reactive form group defining structure and field validation rules. */
  editContactForm = new FormGroup({
    firstname: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),

    lastname: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),

    email: new FormControl('', {
      validators: [Validators.required, Validators.pattern(EditContactModal.EMAIL_PATTERN)],
    }),

    phone: new FormControl('', { validators: [Validators.required] }),
  });

  /**
   * Validates form inputs, saves updated contact details to Supabase, and triggers close animation.
   */
  async saveContact() {
    if (this.editContactForm.invalid) {
      this.editContactForm.markAllAsTouched();
      return;
    }

    const formValue = this.editContactForm.getRawValue();
    const updatedContact = {
      first_name: formValue.firstname!,
      last_name: formValue.lastname!,
      email: formValue.email!,
      phone: formValue.phone!,
    };
    await this.contacts.updateContact(this.contactId, updatedContact);
    this.requestClose();
  }

  /**
   * Permanently deletes contact from Supabase and triggers close animation.
   */
  async deleteContact() {
    await this.contacts.deleteContact(this.contactId);
    this.requestClose();
  }

  /**
   * Initiates close animation sequence with fallback timer.
   */
  requestClose() {
    if (this.isClosing) {
      return;
    }

    this.isClosing = true;
    this.animationCloseTimer = window.setTimeout(() => {
      this.emitClose();
    }, this.animationDuration);
  }

  /**
   * Handles click events on backdrop overlay to close modal when clicking outside contents.
   *
   * @param event - Mouse click event.
   */
  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.requestClose();
    }
  }

  /**
   * Listens for SCSS slide-out animation finish events to cleanly emit close event.
   *
   * @param event - SCSS Animation event.
   */
  onModalAnimationEnd(event: AnimationEvent) {
    if (!this.isClosing || event.target !== event.currentTarget) {
      return;
    }

    if (event.animationName === 'slideOutToBottom' || event.animationName === 'slideOutToRight') {
      this.emitClose();
    }
  }

  /**
   * Safely clears pending animation timers and emits output close event.
   */
  private emitClose() {
    if (!this.isClosing) {
      return;
    }

    this.isClosing = false;
    
    if (this.animationCloseTimer) {
      window.clearTimeout(this.animationCloseTimer);
      this.animationCloseTimer = undefined;
    }

    this.close.emit();
  }
}
