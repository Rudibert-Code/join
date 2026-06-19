import { Injectable,Component, inject } from '@angular/core';
import { Supabase } from '../../supabase';
import { EditContactModal } from '../edit-contact-modal/edit-contact-modal';
import { timeout } from 'rxjs';

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
  db = inject(Supabase);

  userName:String=""; 
  userSurName:String="";
  userEmail:String="";
  userPhone:String="";
  userInitials:String="";
  userColor:String="";
  selectedContactId: number | null = null;
  isEditModalOpen = false;

  loadDetails(contactId:number){
    let contact = this.db.contacts();
    let selectedContact = contact.find(contact => contact.id === contactId);
    
    if (!selectedContact) {
      return;
    }

    this.selectedContactId = selectedContact.id;
    this.userName = String(selectedContact.first_name);
    this.userSurName = String(selectedContact.last_name);
    this.userEmail = String(selectedContact.email);
    this.userPhone = String(selectedContact.phone);
    this.userColor = String(selectedContact.color);
    this.userInitials = (this.userName.charAt(0).toUpperCase())+(this.userSurName.charAt(0).toUpperCase());

    let userIcon = document.getElementById('user_initials') as HTMLDivElement;
    userIcon.style.backgroundColor = String(this.userColor);
  }

  openEditModal() {
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;

    if (this.selectedContactId !== null) {
      this.loadDetails(this.selectedContactId);
    }
  }

  async deleteContact() {

    if (this.selectedContactId === null) {
      return;
    }

    await this.db.deleteContact(this.selectedContactId);

    // Timeout : macht Update asynchron. Updates haben Fehler verursacht, da sie nach change detection ausgeführt wurden.
    setTimeout(()=>{

    this.selectedContactId = null;
    this.userName = "";
    this.userSurName = "";
    this.userEmail = "";
    this.userPhone = "";
    this.userInitials = "";
    this.isEditModalOpen = false;

    this.resetWindow();

    },0)
    
  }

  resetWindow(){
    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement; 
    detailsPopUp.classList.toggle('active')
  }
}
