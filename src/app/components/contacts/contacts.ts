import { Component, inject } from '@angular/core';
import { Supabase } from '../../supabase';

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {

  private db = inject(Supabase)
    get contacts() {
    return this.db.contacts()
  }

  testFunction(){
    console.table(this.db.contacts());
  }
  
  //userName:string = ""
  //reassembledList:string[]=[] 
//
  //searchedName:string = ""


  //sortByAlphabet(){
//
  //  this.reassembledList.slice(0, 0);
  //  console.log("FIRST STEP" , this.reassembledList)
//
  //  // search sorce-array for user names > add user names to reassembling list 
  //  for (let index = 0; index < this.placeholders.length; index++) {
  //    this.userName = String(this.placeholders[index].name);
  //    this.reassembledList.splice(index, 0, this.userName);
  //  }
//
  //  // sort reassembling list alphabetically
  //  this.reassembledList.sort();
  //  console.log("SECOND STEP" , this.reassembledList)
//
  //}
}
