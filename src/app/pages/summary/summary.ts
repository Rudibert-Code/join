import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
  standalone: true,
  imports: [DatePipe],
})
export class Summary {
  heute: Date = new Date();

  constructor() {
    this.heute.setDate(this.heute.getDate() + 5);
  }
}
