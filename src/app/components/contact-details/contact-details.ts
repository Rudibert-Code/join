import { Injectable,Component, inject } from '@angular/core';
import { Supabase } from '../../supabase';
import { EditContactModal } from '../edit-contact-modal/edit-contact-modal';
import { timeout } from 'rxjs';

let savedName:string="";
let savedSurName:string="";
let savedPhone:string="";
let savedEmail:string="";
let savedColor:string="";

let isActive:boolean=false;

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

  detailViewActive = isActive;

  userName:String= savedName; 
  userSurName:String=savedSurName;
  userEmail:String=savedEmail;
  userPhone:String=savedPhone;
  userInitials:String=(this.userName.charAt(0).toUpperCase())+(this.userSurName.charAt(0).toUpperCase());
  userColor:String=savedColor;
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
    savedName = String(selectedContact.first_name);
    this.userSurName = String(selectedContact.last_name);
    savedSurName = String(selectedContact.last_name);
    this.userEmail = String(selectedContact.email);
    savedEmail = String(selectedContact.email);
    this.userPhone = String(selectedContact.phone);
    savedPhone = String(selectedContact.phone);
    this.userColor = String(selectedContact.color);
    savedColor = String(selectedContact.color);
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
    this.closeWindow();

    if (this.selectedContactId === null) {
      return;
    }

    await this.db.deleteContact(this.selectedContactId);

    setTimeout(()=>{
    this.selectedContactId = null;
    this.userName = "";
    this.userSurName = "";
    this.userEmail = "";
    this.userPhone = "";
    this.userInitials = "";
    this.isEditModalOpen = false;
    },0)

    isActive = this.detailViewActive;
  }

 getFirstEntry(){
    this.userName = this.db.contacts()[0].first_name;
    this.userSurName = this.db.contacts()[0].last_name;
    this.userEmail = this.db.contacts()[0].email;
    this.userPhone = this.db.contacts()[0].phone;
    this.userInitials = (this.userName.charAt(0).toUpperCase())+(this.userSurName.charAt(0).toUpperCase());
 }



  //resetWindow(){
  //  let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement; 
  //  if (detailsPopUp.classList.contains("active")) {
  //    detailsPopUp.classList.remove("active");
  //    detailsPopUp.classList.add("in-active");
  //    this.detailViewActive = false
  //  } else{
  //    detailsPopUp.classList.remove("in-active");
  //    detailsPopUp.classList.add("active");
  //    this.detailViewActive = true;
  //  }
  //}

  openWindow(){
    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement;
    detailsPopUp.classList.remove("in-active"); 
    if (detailsPopUp.classList.contains("active")) {
      detailsPopUp.classList.remove("active");
    }
    setTimeout(()=>{
    detailsPopUp.classList.add("active");
    },0)
  }

  closeWindow(){
    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement; 
    detailsPopUp.classList.remove("active");
    detailsPopUp.classList.add("in-active");
  }

  changeState(X:boolean){
    this.detailViewActive = X;
  }
}
