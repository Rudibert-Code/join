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
  deadline: Date = new Date();

  constructor() {
    this.deadline.setDate(this.deadline.getDate() + 5);
  }
}
