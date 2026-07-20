import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supabase } from '../../supabase';

@Component({
  selector: 'app-edit-contact-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-contact-modal.html',
  styleUrl: './edit-contact-modal.scss',
})
export class EditContactModal {
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  contacts = inject(Supabase);
  avatarColor: string = '';
  initalFirstname: string = '';
  initalLastname: string = '';
  isClosing = false;
  @Input() contactId!: number;
  @Output() close = new EventEmitter<void>();

  private animationCloseTimer?: number;
  private readonly animationDuration = 250;

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

  async deleteContact() {
    await this.contacts.deleteContact(this.contactId);
    this.requestClose();
  }

  requestClose() {
    if (this.isClosing) {
      return;
    }

    this.isClosing = true;
    this.animationCloseTimer = window.setTimeout(() => {
      this.emitClose();
    }, this.animationDuration);
  }

  onModalAnimationEnd(event: AnimationEvent) {
    if (!this.isClosing || event.target !== event.currentTarget) {
      return;
    }

    if (event.animationName === 'slideOutToBottom' || event.animationName === 'slideOutToRight') {
      this.emitClose();
    }
  }

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
