import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Board } from '../../pages/board/board';
import { ContactService } from '../../core/services/contact.service';
import { SubtaskService } from '../../core/services/subtask.service';

/**
 * Mobile view wrapper providing access to board state and actions.
 */
@Component({
  selector: 'app-board-mobile',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './board-mobile.html',
  styleUrl: './board-mobile.scss',
})

export class BoardMobile {
  board = inject(Board);
  cs = inject(ContactService);
  sts = inject(SubtaskService);
}
