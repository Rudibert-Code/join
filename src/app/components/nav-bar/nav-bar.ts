import { Component } from '@angular/core';

interface Functions{
  img:String,
  name:String,
  id:string
}

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})

export class NavBar {
  function:Functions[]=[
    {
      img:'/assets/UI/vector/icon_summary.svg',
      name:'Summary',
      id:'summary'
    },
    {
      img:'/assets/UI/vector/icon_add-task.svg',
      name:'Add Tasks',
      id:'addtasks'
    },
    {
      img:'/assets/UI/vector/icon_board.svg',
      name:'Board',
      id:'board'
    },
    {
      img:'/assets/UI/icon_contacts.png',
      name:'Contacts',
      id:'contacs'
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
