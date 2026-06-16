import { Component } from '@angular/core';
import { NavBar } from "../../components/nav-bar/nav-bar";
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-summary',
  imports: [NavBar, Header],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary {}
