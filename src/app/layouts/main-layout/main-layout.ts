import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';

/**
 * Main application layout wrapper containing the header, navigation bar, and router outlet.
 */
@Component({
  selector: 'app-main-layout',
  imports: [Header, NavBar, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
