import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { ContactForm } from '../contact-form/contact-form';
import { Supabase } from '../../supabase';

@Component({
  selector: 'app-contacs-button',
  standalone: true,
  imports: [CommonModule, ContactForm],
  templateUrl: './contacs-button.html',
  styleUrl: './contacs-button.scss',
})
export class ContacsButton {
  
  db = inject(Supabase);

  showContactForm = signal(false);

  openContactForm() {
    this.showContactForm.set(true);
  }

  closeContactForm() {
    this.showContactForm.set(false);
  }
}
