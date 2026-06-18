import { Injectable,Component, inject } from '@angular/core';
import { Supabase } from '../../supabase';
import { EditContactModal } from '../edit-contact-modal/edit-contact-modal';

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
    this.userInitials = (this.userName.charAt(0).toUpperCase())+(this.userSurName.charAt(0).toUpperCase());
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
  
  test(){
    console.log("SAY HI")
  }
}
