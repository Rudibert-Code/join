import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header'
import { NavBar } from './components/nav-bar/nav-bar'
import { Supabase } from './supabase';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,NavBar,JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('join');
  dbService = inject(Supabase)

  ngOnInit(){
    this.dbService.getContacts()
  }
}
