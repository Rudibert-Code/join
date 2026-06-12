import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-dummy',
  imports: [Header,NavBar],
  templateUrl: './dummy.html',
  styleUrl: './dummy.scss',
})
export class Dummy {}
