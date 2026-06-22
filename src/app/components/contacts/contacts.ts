import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact, Supabase } from '../../supabase';
import { ContactForm } from '../contact-form/contact-form';
import { ContactDetails } from '../contact-details/contact-details'
import { ContacsButton } from "../contacs-button/contacs-button";
import { first } from 'rxjs';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { Router } from '@angular/router';

let userInitials:string="";
let userColor:String="";
let userName:string="";
let userSurName:string="";
let userEmail:string="";
let userPhone:string="";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactForm, ContacsButton, RouterLink, RouterLinkActive],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {

  

  db = inject(Supabase);
  
  showContactForm = signal(false);

  openContactForm() {
    this.showContactForm.set(true);
  }

  closeContactForm() {
    this.showContactForm.set(false);
  }
  
  cd = inject(ContactDetails);

  // Zwischenspeicher für Contact Color
  currentUserList:String[] = [];



  groupedContacts = computed(() => {
    const groups = new Map<string, Contact[]>();

    for (const contact of this.db.contacts()) {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();

      if (!groups.has(firstLetter)) {
        groups.set(firstLetter, []);
      }

      groups.get(firstLetter)!.push(contact);

      // fügt Contact Color-ID zu Zwischenspeicher Array hinzu
      this.currentUserList.push(contact.color);
    }
    return Array.from(groups.entries());
  });

  getInitials(contact: any) {
    const firstNameLetter = contact.first_name.charAt(0).toUpperCase();
    const lastNameLetter = contact.last_name.charAt(0).toUpperCase();

    return firstNameLetter + lastNameLetter;
  }

userInitials:string="";
userColor:String="";
userName:string="";
userSurName:string="";
userEmail:string="";
userPhone:string="";

constructor(private router: Router) {}

@Output() contactSelected = new EventEmitter<Contact>();

openContactDetails(contact: Contact) {
  this.contactSelected.emit(contact);

  let contactContainer = document.getElementById('contact_container') as HTMLDivElement;
  let detailContainer = document.getElementById('details_mobile') as HTMLDivElement;

  if (screen.width >= 1190) {
    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement;
    detailsPopUp.classList.toggle('active')
  }

  let buttonMobile = document.getElementById('contact-button_img') as HTMLImageElement;
  buttonMobile.src="assets/UI/vector/icon_edit-user.svg"

  let contactID = Number(contact.id);
  this.cd.loadDetails(contactID);

  if (screen.width <= 1189){
    let array = this.db.contacts();
    this.userName = array[contactID].first_name;
    this.userSurName = array[contactID].last_name;
    this.userInitials = this.userName.charAt(0).toUpperCase()+this.userSurName.charAt(0).toUpperCase(); 
    this.userEmail = array[contactID].email;
    this.userPhone = array[contactID].phone;

    contactContainer.style.display="none"
    detailContainer.style.display="flex"
  }
}

returnToContacts(){
  let contactContainer = document.getElementById('contact_container') as HTMLDivElement;
  let detailContainer = document.getElementById('details_mobile') as HTMLDivElement;
  let buttonMobile = document.getElementById('contact-button_img') as HTMLImageElement;
  buttonMobile.src="assets/UI/vector/icon_add-user.svg";
  contactContainer.style.display="flex";
  contactContainer.style.flexDirection="column";
  detailContainer.style.display="none";
}



// for-Schleife geht Zwischenspeicher Array durch, added class passend zur Color-ID zum entsprechenden component hinzu
setUserIconColor(){

  for (let index = 0; index < this.currentUserList.length; index++) {  
    let contactID = String(this.currentUserList[index]);
    let colorClass = "bg-color_" + String(this.currentUserList[index]).slice(1);

    let currenContact = document.getElementById(contactID);
    currenContact?.classList.add(colorClass);
  }
}

  //openRouterLink(){
  //  this.router.navigate(['/contact-list-mobile-details']);
  //}
  //openContactDetails(contact:number) {
  //  let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement;
  //  detailsPopUp.classList.toggle('active')
  //  this.cd.loadDetails(contact);
  //}
}
