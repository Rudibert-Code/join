import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

interface Functions{
  img:String,
  name:String,
  id:string,
  routlink:string
  trigger?:string
}

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})

export class NavBar {
  function:Functions[]=[
    {
      img:'/assets/UI/vector/icon_summary.svg',
      name:'Summary',
      id:'summary',
      routlink:''
    },
    {
      img:'/assets/UI/vector/icon_add-task.svg',
      name:'Add Tasks',
      id:'addtasks',
      routlink:''
    },
    {
      img:'/assets/UI/vector/icon_board.svg',
      name:'Board',
      id:'board',
      routlink:''
    },
    {
      img:'/assets/UI/icon_contacts.png',
      name:'Contacts',
      id:'contacs',
      routlink:'contact-list',
      trigger:''
    },
  ]

  // on click : background-color of all icons to default, then switch SELECTED icon background   
  selectOption(icon:Functions){

    let selectedIcon = document.getElementById(icon.id) as HTMLDivElement;

    for (let index = 0; index < this.function.length; index++) {
      let currentIconID = this.function[index].id;
      let currentIcon = document.getElementById(currentIconID) as HTMLDivElement;
      currentIcon.style.backgroundColor = '#2a3647'; 
    }

    selectedIcon.style.backgroundColor = '#091931';
  }
}
