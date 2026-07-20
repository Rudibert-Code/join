import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Supabase, newContact } from '../../supabase';

/**
 * Modal form component for creating and persisting new contact records.
 */
@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  /** Event emitted when the form requests closing. */
  @Output() close = new EventEmitter<void>();

  /** State flag controlling slide-out close animations. */
  isClosing = false;

  /** Angular Router instance for navigation. */
  router = inject(Router);

  /** Supabase service instance for creating contact records. */
  db = inject(Supabase);

  /** Reactive form group with controls and validation rules for new contacts. */
  contactForm = new FormGroup({
    first_name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
    last_name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.pattern('^[^@]+@[^@.]{3,}\\.[a-zA-Z]{2,}$')],
    }),
    phone: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5), Validators.pattern(/^[0-9]+$/)],
    }),
  });

  /**
   * Submits valid contact data to Supabase and initiates component close sequence.
   */
  async onSubmit() {
    if (this.contactForm.valid) {
      const contactPayload: newContact = this.contactForm.value as newContact;
      const data = await this.db.setContact(contactPayload);
      this.requestClose();
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  /** Timer handle for fallback close animation timeout. */
  private animationCloseTimer?: number;

  /** Fallback timeout duration in milliseconds matching SCSS animation speed. */
  private ANIMATION_DURATION = 250;

  /**
   * Triggers the close animation sequence and fallback timer.
   */
  requestClose() {
    if (this.isClosing) {
      return;
    }
    this.isClosing = true;
    this.animationCloseTimer = window.setTimeout(() => {
      this.emitClose();
    }, this.ANIMATION_DURATION);
  }

  /**
   * Listens for panel slide-out SCSS animation end events to trigger close emit.
   *
   * @param event - CSS Animation event.
   */
  onPanelAnimationEnd(event: AnimationEvent) {
    if (!this.isClosing || event.target !== event.currentTarget) {
      return;
    }
    if (event.animationName === 'slideDown' || event.animationName === 'slideOut') {
      this.emitClose();
    }
  }

  /**
   * Clears active animation timers and emits output close event.
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
