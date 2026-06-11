import { Component } from '@angular/core';

interface dummyList{
  name:string,
  surname:string,
  eMail:string,
}

@Component({
  selector: 'app-contacts',
  imports: [],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {

  placeholders:dummyList[]=[
    {
      name:"Helga",
      surname:"Helga",
      eMail:"helga@mail.de",
    },
    {
      name:"Alex",
      surname:"Alex",
      eMail:"alex@mail.de",
    },
    {
      name:"Maria",
      surname:"Maria",
      eMail:"maria@mail.de",
    },
    {
      name:"Ben",
      surname:"Ben",
      eMail:"ben@mail.de",
    },
    {
      name:"Herbert",
      surname:"Herbert",
      eMail:"herbert@mail.de",
    },
  ]
  
  userName:string = ""
  reassembledList:string[]=[] 


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
