import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Supabase, newContact } from '../../supabase';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  @Output() close = new EventEmitter<void>();

  router = inject(Router);
  db = inject(Supabase);

  contactForm = new FormGroup({
    first_name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
    last_name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', { validators: [Validators.required, this.emailValidate] }),
    phone: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5), Validators.pattern(/^[0-9]+$/)],
    }),
  });

  emailValidate(control: AbstractControl) {
    const email = control.value;
    if (!email) return null;
    return email.includes('@') ? null : { missingAt: true };
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      const contactPayload: newContact = this.contactForm.value as newContact;
      const data = await this.db.setContact(contactPayload);
      this.router.navigate(['']);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
