import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Board } from '../../pages/board/board';

@Component({
  selector: 'app-board-mobile',
  standalone: true,
  imports: [FormsModule,RouterLink,CommonModule],
  templateUrl: './board-mobile.html',
  styleUrl: './board-mobile.scss',
})
export class BoardMobile {
  board = inject(Board);
}
