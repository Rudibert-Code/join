import { Injectable,Component, inject, ViewChild } from '@angular/core';
import { Supabase } from '../../supabase';
import { Contacts } from '../../components/contacts/contacts';

@Component({
  selector: 'app-contact-details',
  imports: [],
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

  loadDetails(X:number){
    let contact = this.db.contacts();
    this.userName = String(contact[X].first_name);
    this.userSurName = String(contact[X].last_name);
    this.userEmail = String(contact[X].email);
    this.userPhone = String(contact[X].phone);
    this.userInitials = (this.userName.charAt(0).toUpperCase())+(this.userSurName.charAt(0).toUpperCase());
  }
  
  test(){
    console.log("SAY HI")
  }
}
