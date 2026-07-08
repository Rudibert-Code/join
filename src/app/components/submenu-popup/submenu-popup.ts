import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Supabase } from '../../supabase';
import { timeout } from 'rxjs';

//let isActive:any = false;

@Component({
  selector: 'app-submenu-popup',
  imports: [RouterLink],
  templateUrl: './submenu-popup.html',
  styleUrl: './submenu-popup.scss',
})

export class SubmenuPopup {
  supabase = inject(Supabase);
  isActive: any = false;

  toggleSubMenu() {
    let submenuBox = document.getElementById('submenu') as HTMLDialogElement;
    if (this.isActive == false) {
      submenuBox.classList.remove('out');
      submenuBox.classList.add('in');
      this.isActive = true;
    } else {
      submenuBox.classList.remove('in');
      submenuBox.classList.add('out');
      this.isActive = false;
    }
  }

  @HostListener('document:click', ['$event'])
  closeSubMenuPopUp(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const submenuPopUp = document.getElementById('submenu');

    if (this.isActive == true && !submenuPopUp?.contains(clickedElement)) {
      this.toggleSubMenu();
    }
  }

  signOut() {
    this.supabase.signOut();
  }
}
