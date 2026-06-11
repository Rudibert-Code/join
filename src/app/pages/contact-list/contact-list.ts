import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Contacts } from '../../components/contacts/contacts';
import { App } from "../../app";

@Component({
  selector: 'app-contact-list',
  imports: [Header,Contacts,NavBar],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList {}
