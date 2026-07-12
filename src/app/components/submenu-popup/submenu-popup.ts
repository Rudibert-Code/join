import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../supabase';

//let isActive:any = false;

@Component({
  selector: 'app-submenu-popup',
  imports: [RouterLink],
  templateUrl: './submenu-popup.html',
  styleUrl: './submenu-popup.scss',
})
export class SubmenuPopup {
  supabase = inject(Supabase);
  router = inject(Router);
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

  async signOut() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}
