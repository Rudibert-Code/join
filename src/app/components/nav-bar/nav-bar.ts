import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Supabase } from '../../supabase';

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

  /**
   * Signs the current user out via Supabase and redirects to the login route.
   */
  async logout() {
    await this.db.signOut();
    this.router.navigate(['/login']);
  }
}