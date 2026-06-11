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

  sortByAlphabet(){
  }
}
