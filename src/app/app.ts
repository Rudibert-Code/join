import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header'
import { NavBar } from './components/nav-bar/nav-bar'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('join');
}
