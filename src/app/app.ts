import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Supabase } from './core/services/supabase';
import { Auth } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('join');
  dbService = inject(Supabase);
  authService = inject(Auth)

  ngOnInit() {
    this.authService.initAuth();
    this.dbService.getContacts();
  }
}
