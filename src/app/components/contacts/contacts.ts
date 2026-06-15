import { Component, inject } from '@angular/core';
import { Supabase } from '../../supabase';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

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

  sortNames(){
    let contactList = this.db.contacts();

    for (let index = 0; index < contactList.length; index++) { 
      let targetID:string;  

      let firstName:string = contactList[index].first_name;
      let lastName:string = contactList[index].last_name;
      let email:string = contactList[index].email;

      let firstLetter:string = firstName.charAt(0);
      let firstLetterB:string = lastName.charAt(0);

      switch (firstLetter){
          case "A":
            targetID = 'a';
            break;
          case "B":
            targetID = 'b';
            break;
          case "C":
            targetID = 'c';
            break;
          case "D":
            targetID = 'd';
            break;
          case "E":
            targetID = 'e';
            break;
          case "F":
            targetID = 'f';
            break;
          case "G":
            targetID = 'g';
            break;
          case "H":
            targetID = 'h';
            break;
          case "I":
            targetID = 'i';
            break;
          case "J":
            targetID = 'j';
            break;
          case "K":
            targetID = 'k';
            break;
          case "L":
            targetID = 'l';
            break;
          case "M":
            targetID = 'm';
            break;
          case "N":
            targetID = 'n';
            break;
          case "O":
            targetID = 'o';
            break;
          case "P":
            targetID = 'p';
            break;
          case "Q":
            targetID = 'q';
            break;
          case "R":
            targetID = 'r';
            break;
          case "S":
            targetID = 's';
            break;
          case "T":
            targetID = 't';
            break;
          case "U":
            targetID = 'u';
            break;
          case "V":
            targetID = 'v';
            break;
          case "W":
            targetID = 'w';
            break;
          case "X":
            targetID = 'x';
            break;
          case "Y":
            targetID = 'y';
            break;
          case "Z":
            targetID = 'z';
            break;
          default:
            targetID = 'z';
      }  

    let targetBracket = document.getElementById("bracket_"+targetID) as HTMLDivElement;

    targetBracket.style.display="flex";

    console.log(firstName,lastName,email)
    
    // template WIP
    let targetContainer = document.getElementById(targetID) as HTMLDivElement;

    targetContainer.innerHTML += `<div class="contact">
                    <div class="contact-icon_base" id="">
                      <div class="contactIcon">
                        <p>${firstLetter}${firstLetterB}</p>
                      </div>  
                    </div>
                    <div class="contact_info">
                        <p>${firstName} ${lastName}</p>
                        <p class="email">${email}</p>
                    </div>
                </div>`;
    }
  }
}
