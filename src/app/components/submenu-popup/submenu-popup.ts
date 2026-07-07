import { Injectable, Component } from '@angular/core';

@Component({
  selector: 'app-submenu-popup',
  imports: [],
  templateUrl: './submenu-popup.html',
  styleUrl: './submenu-popup.scss',
})

@Injectable({
  providedIn: 'root',
})

export class SubmenuPopup {

  isActive:boolean = false;

  toggleSubMenu(){
    let submenuBox = document.getElementById('submenu') as HTMLDialogElement;
    if (this.isActive == false) {
      submenuBox.classList.remove("out");
      submenuBox.classList.add("in");
      this.isActive = true;
    } else{
      submenuBox.classList.remove("in");
      submenuBox.classList.add("out");
      this.isActive = false;
    }
  }
}
