import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Supabase } from '../../supabase';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  db = inject(Supabase);
  router = inject(Router);

  async logout() {
    await this.db.signOut();
    this.router.navigate(['/login']);
  }
}