import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Contact, Supabase } from '../../supabase';
import { ContactForm } from '../contact-form/contact-form';
import { ContactDetails } from '../contact-details/contact-details'

interface contactCache {
  id:number;
}

let currentContact:contactCache[] = [];

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactForm],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})

export class Contacts {
  db = inject(Supabase);
  cd = inject(ContactDetails);
  
  showContactForm = signal(false);

  openContactForm() {
    this.showContactForm.set(true);
  }

  closeContactForm() {
    this.showContactForm.set(false);
  }
  
  groupedContacts = computed(() => {
    const groups = new Map<string, Contact[]>();

    for (const contact of this.db.contacts()) {
      const firstLetter = contact.first_name.charAt(0).toUpperCase();

      if (!groups.has(firstLetter)) {
        groups.set(firstLetter, []);
      }

      groups.get(firstLetter)!.push(contact);
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


@Output() contactSelected = new EventEmitter<Contact>();
@Output() mobileDetailViewChange = new EventEmitter<boolean>();

ngOnInit() {
  if (currentContact.length > 0 && !this.isMobileViewport()) {
    const currentContactID = currentContact[0].id;
    for (let index = 0; index < this.db.contacts().length; index++) {
      if (this.db.contacts()[index].id == currentContactID) {
        let currentContactData:Contact = ({
          id: currentContactID,
          first_name: this.db.contacts()[index].first_name,
          last_name: this.db.contacts()[index].last_name,
          phone: this.db.contacts()[index].phone,
          email: this.db.contacts()[index].email,
          color: this.db.contacts()[index].color
        });
        this.openContactDetails(currentContactData);
      }
    }
    this.cd.openWindow();
    this.cd.loadDetails(currentContactID);
  }
}

openContactDetails(contact: Contact) {
  this.contactSelected.emit(contact);

  currentContact = [{
    id:contact.id
  }]
  
  if (!this.isMobileViewport()) {
    this.cd.openWindow();
  }

  if (this.isMobileViewport()) {
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
    this.mobileDetailViewChange.emit(true);
    this.cd.openWindow();
  }

  this.cd.loadDetails(contact.id);

  setTimeout(()=>{
  this.markContactAsClicked(contact); 
  },0)
}

markContactAsClicked(contact:Contact){
  for (let index = 0; index < this.db.contacts().length; index++) {
    let currentContactID = this.db.contacts()[index].last_name + this.db.contacts()[index].id ;
    let targetContactIcon = document.getElementById(currentContactID);
    targetContactIcon?.classList.remove("clicked");
    this.cd.changeState(true);
  }
  let userID = String(contact.last_name + contact.id);
  let userIconID = document.getElementById(userID) as HTMLDivElement;
  userIconID.classList.add("clicked");
}

returnToContacts(){
  let contactContainer = document.getElementById('contact_container') as HTMLDivElement;
  let detailContainer = document.getElementById('details_mobile') as HTMLDivElement;
  contactContainer.style.display="flex";
  contactContainer.style.flexDirection="column";
  detailContainer.style.display="none";
  this.mobileDetailViewChange.emit(false);
  this.cd.changeState(false);
}

private isMobileViewport() {
  return window.matchMedia('(max-width: 1023px)').matches;
}
}
