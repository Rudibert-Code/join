import { Component, computed, inject } from '@angular/core';
import { Supabase } from '../../supabase';
import { RouterLink } from '@angular/router';
import { SubmenuPopup } from '../submenu-popup/submenu-popup';

@Component({
  selector: 'app-header',
  imports: [RouterLink,SubmenuPopup],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  db = inject(Supabase);
  submanu = inject(SubmenuPopup);
  
  openSubMenu(){
    this.submanu.toggleSubMenu();
  }

  userInitials = computed(() => {
    if (this.db.isGuest()) {
      return 'G';
    }

    const user = this.db.authUser();

    if (!user) {
      return '';
    }

    const firstName = user.user_metadata?.['first_name'] || '';
    const lastName = user.user_metadata?.['last_name'] || '';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    if (initials) {
      return initials;
    }

    return user.email?.charAt(0).toUpperCase() || '';
  });
}
