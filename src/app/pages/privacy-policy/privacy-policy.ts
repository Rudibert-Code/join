import { Component } from '@angular/core';
import { Contacts } from '../../components/contacts/contacts';
import { ContacsButton } from '../../components/contacs-button/contacs-button';
import { Header } from '../../components/header/header';
import { NavBar } from '../../components/nav-bar/nav-bar';

@Component({
  selector: 'app-privacy-policy',
  imports: [Contacts,ContacsButton,Header,NavBar],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {}
