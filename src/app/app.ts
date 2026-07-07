import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Supabase } from './supabase';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('join');
  dbService = inject(Supabase);

  ngOnInit() {
    this.dbService.initAuth();
    this.dbService.getContacts();
    //this.dbService.setContact({first_name: 'string2' last_name: 'string2',phone: 'string2', email: 'string2'});
    //this.dbService.updateContact({id:number})
    //this.dbService.deleteContact({id:number})
  }
}
