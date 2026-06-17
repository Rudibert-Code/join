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

  loadDetails(X:any){
    let testMeh = this.db.contacts();
    this.userName = testMeh[X].first_name;
    this.userSurName = testMeh[X].last_name;
    this.userEmail = testMeh[X].email;
    this.userPhone = testMeh[X].phone;
    this.userInitials = (this.userName.charAt(0).toUpperCase())+(this.userSurName.charAt(0).toUpperCase());
  }
  
  test(){
    console.log("HI")
  }
}
