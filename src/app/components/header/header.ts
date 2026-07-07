import { Component, inject } from '@angular/core';
import { SubmenuPopup } from '../submenu-popup/submenu-popup';

@Component({
  selector: 'app-header',
  imports: [SubmenuPopup],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  submanu = inject(SubmenuPopup);
  openSubMenu(){
    this.submanu.toggleSubMenu();
  }
}
