import { Component } from '@angular/core';

interface Functions{
  img:String,
  name:String,
  id:String
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
}
