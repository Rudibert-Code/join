import { Component, inject } from '@angular/core';
import { Supabase } from '../../supabase';
import { Contacts } from '../../components/contacts/contacts';

@Component({
  selector: 'app-contact-details',
  imports: [],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.scss',
})
export class ContactDetails {
  db = inject(Supabase);

  userName:string=""; 
  userSurName:string="";
  userEmail:string="";
  userPhone:string="";
  userInitials:string="";

  loadDetails(){
    let testMeh = this.db.contacts();
    this.userName = testMeh[0].first_name;
    this.userSurName = testMeh[0].last_name;
    this.userEmail = testMeh[0].email;
    this.userPhone = testMeh[0].phone;
    this.userInitials = (this.userName.charAt(0).toUpperCase())+(this.userSurName.charAt(0).toUpperCase());
  }
  
  test(){
    console.log("HI")
  }
}
