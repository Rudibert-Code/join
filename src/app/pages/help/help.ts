import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

/**
 * Renders the help page and manages back-navigation.
 */
@Component({
  selector: 'app-help',
  imports: [],
  templateUrl: './help.html',
  styleUrl: './help.scss',
})

export class Help {
  location = inject(Location);

  /**
   * Navigates back to the previously visited page in history.
   */
  goBack() {
    this.location.back();
  }
}