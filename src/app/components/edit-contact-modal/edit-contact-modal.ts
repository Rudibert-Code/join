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
  contacts = inject(Supabase);
  avatarColor: string = '';
  initalFirstname: string = '';
  initalLastname: string = '';
  @Input() contactId!: number;
  @Output() close = new EventEmitter<void>();

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
    firstname: new FormControl('', { validators: [Validators.required] }),
    lastname: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
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
    this.close.emit();
  }

  async deleteContact() {
    await this.contacts.deleteContact(this.contactId);
    this.close.emit();
  }
}
