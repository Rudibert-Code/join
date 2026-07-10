import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact, Supabase } from '../../supabase';
import { ContactForm } from '../contact-form/contact-form';
import { ContactDetails } from '../contact-details/contact-details'
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
  imports: [CommonModule, ContactForm],
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

  currentUserList:number[] = [];



  groupedContacts = computed(() => {
    const groups = new Map<string, Contact[]>();

    for (const contact of this.db.contacts()) {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();

      if (!groups.has(firstLetter)) {
        groups.set(firstLetter, []);
      }

      groups.get(firstLetter)!.push(contact);

      this.currentUserList.push(contact.id);
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

detailViewActive:Boolean = false;


constructor(private router: Router) {}

@Output() contactSelected = new EventEmitter<Contact>();

openContactDetails(contact: Contact) {
  this.contactSelected.emit(contact);
  
  if (screen.width >= 1190 && this.detailViewActive == false) {
    let detailsPopUp = document.getElementById('contactDetails') as HTMLDialogElement;
    detailsPopUp.classList.toggle('active') 
  }

  let buttonMobile = document.getElementById('contact-button_img') as HTMLImageElement;
  buttonMobile.src="assets/UI/vector/icon_edit-user.svg"

  if (screen.width <= 1189 && this.detailViewActive == false){
    let contactContainer = document.getElementById('contact_container') as HTMLDivElement;
    let detailContainer = document.getElementById('details_mobile') as HTMLDivElement;
    let contactID = Number(contact.id);
    let array = this.db.contacts();

    for (let index = 0; index < array.length; index++) {
      if (array[index].id == contactID) {
        this.userName = array[index].first_name;
        this.userSurName = array[index].last_name;
        this.userInitials = this.userName.charAt(0).toUpperCase()+this.userSurName.charAt(0).toUpperCase(); 
        this.userEmail = array[index].email;
        this.userPhone = array[index].phone;
        this.userColor = array[index].color;
        let userIcon = document.getElementById('user_icon') as HTMLParagraphElement;
        userIcon.style.backgroundColor = String(this.userColor);
      }      
    }

    contactContainer.style.display="none"
    detailContainer.style.display="flex"
    this.detailViewActive = true;
  }
  for (let index = 0; index < this.db.contacts().length; index++) {
    let currentContactID = this.db.contacts()[index].last_name + this.db.contacts()[index].id ;
    let targetContactIcon = document.getElementById(currentContactID);
    targetContactIcon?.classList.remove("clicked");
    this.detailViewActive = true;
  }
  let userIconID = document.getElementById(contact.last_name + contact.id) as HTMLDivElement;
  userIconID.classList.add("clicked"); 
}

returnToContacts(){
  let contactContainer = document.getElementById('contact_container') as HTMLDivElement;
  let detailContainer = document.getElementById('details_mobile') as HTMLDivElement;
  let buttonMobile = document.getElementById('contact-button_img') as HTMLImageElement;
  buttonMobile.src="assets/UI/vector/icon_add-user.svg";
  contactContainer.style.display="flex";
  contactContainer.style.flexDirection="column";
  detailContainer.style.display="none";
  this.detailViewActive = false;
}

async setUserIconColor(){
  let contactID:Number;
  let colorCode:String = "";
  let colorClass:String = "";

  for (let index = 0; index < this.currentUserList.length; index++) {  
    contactID = this.currentUserList[index];

    for (let index = 0; index < this.db.contacts().length; index++) {
      
      if (this.db.contacts()[index].id == contactID) {
        colorCode = this.db.contacts()[index].color;
        colorClass = "bg-color_" + colorCode.slice(1);
      }
    }
    let currentContact = document.getElementById(String(contactID)) as HTMLDivElement;
    currentContact?.classList.add(String(colorClass));
  }
}
}
