import { Injectable, Component, inject } from '@angular/core';
import { Supabase } from '../../supabase';
import { EditContactModal } from '../edit-contact-modal/edit-contact-modal';

let savedName: string = '';
let savedSurName: string = '';
let savedPhone: string = '';
let savedEmail: string = '';
let savedColor: string = '';
let isActive: boolean = false;

interface Contact{
  first_name:string,
  last_name:string,
  email:string,
  phone:string,
  color:string,
}

/**
 * Component and root injectable service managing detailed view display,
 * modal editing triggers, and deletion for selected contacts.
 */
@Component({
  selector: 'app-contact-details',
  imports: [EditContactModal],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.scss',
})

@Injectable({
  providedIn: 'root',
})

export class ContactDetails {
  /** Supabase service instance for contact operations and data signals. */
  db = inject(Supabase);

  /** Tracks active visibility state of detail view panel. */
  detailViewActive = isActive;
  userName: String = savedName;
  userSurName: String = savedSurName;
  userEmail: String = savedEmail;
  userPhone: String = savedPhone;
  userInitials: String = this.userName.charAt(0).toUpperCase() + this.userSurName.charAt(0).toUpperCase();
  userColor: String = savedColor;
  /** Database ID of currently selected contact. */
  selectedContactId: number | null = null;

  /** Controls visibility state of edit contact modal dialog. */
  isEditModalOpen = false;

  /**
   * Fetches contact record by ID, populates local view variables, and applies avatar styles.
   *
   * @param contactId - Target contact database ID.
   */
  loadDetails(contactId: number) {
    let contact = this.db.contacts();
    let selectedContact = contact.find((contact) => contact.id === contactId);
    
    if (!selectedContact) {
      return;
    }

    this.selectedContactId = selectedContact.id;
    this.userName = String(selectedContact.first_name);
    this.userSurName = String(selectedContact.last_name);
    this.userEmail = String(selectedContact.email);
    this.userPhone = String(selectedContact.phone);
    this.userColor = String(selectedContact.color);
    this.saveDetails(selectedContact);
    this.userInitials = this.userName.charAt(0).toUpperCase() + this.userSurName.charAt(0).toUpperCase();
    let userIcon = document.getElementById('user_initials') as HTMLDivElement;
    userIcon.style.backgroundColor = String(this.userColor);
  }

  saveDetails(selectedContact: Contact){
    savedName = String(selectedContact.first_name);
    savedSurName = String(selectedContact.last_name);
    savedEmail = String(selectedContact.email);
    savedPhone = String(selectedContact.phone);
    savedColor = String(selectedContact.color);
  }

  /**
   * Displays edit contact modal dialog.
   */
  openEditModal() {
    this.isEditModalOpen = true;
  }

  /**
   * Closes edit contact modal and refreshes active contact details.
   */
  closeEditModal() {
    this.isEditModalOpen = false;

    if (this.selectedContactId !== null) {
      this.loadDetails(this.selectedContactId);
    }
  }

  /**
   * Deletes currently selected contact from database and resets local display state.
   */
  async deleteContact() {
    this.closeWindow();

    if (this.selectedContactId === null) {
      return;
    }

    await this.db.deleteContact(this.selectedContactId);
    setTimeout(() => {
      this.selectedContactId = null;
      this.userName = '';
      this.userSurName = '';
      this.userEmail = '';
      this.userPhone = '';
      this.userInitials = '';
      this.isEditModalOpen = false;
    }, 0);
    isActive = this.detailViewActive;
  }

  /**
   * Opens detail view popup window and applies active transition classes.
   */
  openWindow() {
    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement;
    detailsPopUp.classList.remove('in-active');

    if (detailsPopUp.classList.contains('active')) {
      detailsPopUp.classList.remove('active');
    }

    setTimeout(() => {
      detailsPopUp.classList.add('active');
    }, 0);
  }

  /**
   * Closes detail view popup window with transition classes.
   */
  closeWindow() {
    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement;
    detailsPopUp.classList.remove('active');
    detailsPopUp.classList.add('in-active');
  }

  /**
   * Updates state tracking detail view activity.
   * 
   * @param X - Activity state boolean.
   */
  changeState(X: boolean) {
    this.detailViewActive = X;
  }
}
