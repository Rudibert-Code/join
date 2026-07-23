import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Supabase } from '../../core/services/supabase';
import { Auth } from '../../core/services/auth';

/**
 * Handles the header user avatar dropdown menu popup, menu animation states, click-outside dismissal, and user sign-out.
 */
@Component({
  selector: 'app-submenu-popup',
  imports: [RouterLink],
  templateUrl: './submenu-popup.html',
  styleUrl: './submenu-popup.scss',
})
export class SubmenuPopup {
  /** Supabase service instance for authentication operations. */
  supabase = inject(Supabase);

  /** Supabase service instance for authentication operations. */
  auth = inject(Auth)

  /** Angular Router instance for page navigation. */
  router = inject(Router);

  /** Tracks visibility state of the popup submenu dialog. */
  isActive: boolean = false;

  /**
   * Toggles the submenu popup open/close state and updates SCSS transition classes.
   */
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

  /**
   * Closes the submenu popup when a click occurs outside of the popup container.
   *
   * @param event - Document click mouse event.
   */
  @HostListener('document:click', ['$event'])
  closeSubMenuPopUp(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const submenuPopUp = document.getElementById('submenu');

    if (this.isActive == true && !submenuPopUp?.contains(clickedElement)) {
      this.toggleSubMenu();
    }
  }

  /**
   * Signs the current user out via Authentification Service and redirects to the login route.
   */
  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
