import { Component, computed, inject } from '@angular/core';
import { Supabase } from '../../supabase';
import { RouterLink } from '@angular/router';
import { SubmenuPopup } from '../submenu-popup/submenu-popup';

/**
 * Handles application header display, including brand navigation and dynamically calculated user initials.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink,SubmenuPopup],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  /** Supabase service instance for retrieving current user data and auth state. */
  db = inject(Supabase);

  /**
   * Computed signal that derives user avatar initials from current state.
   * Returns 'G' for guests, uppercase first/last name initials if present,
   * or the first letter of the email address as fallback.
   */
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
