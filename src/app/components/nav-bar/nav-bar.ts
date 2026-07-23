import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Supabase } from '../../core/services/supabase';
import { Auth } from '../../core/services/auth';

/**
 * Handles main side/top navigation menu links and user logout action.
 */
@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  /** Supabase service instance for authentication operations. */
  db = inject(Supabase);

  /** Angular Router instance for page navigation. */
  router = inject(Router);

  /** authentification service instance for authentication operations. */
  auth = inject(Auth)

  /**
   * Signs the current user out via Supabase and redirects to the login route.
   */
  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
