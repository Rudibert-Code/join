import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase, Task } from '../../supabase';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  db = inject(Supabase);
  tasks = computed(() => this.db.tasks());

  taskTitle: string = '';
  taskDescr: string = '';
  taskLimitDate: string = '';
  taskPriority: string = '';
  taskCategory: string = '';

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.db.getTasks();
  }

  get todoTasks() {
    return this.filterTasksByCategory('todo');
  }

  get progressTasks() {
    return this.filterTasksByCategory('progress');
  }

  get feedbackTasks() {
    return this.filterTasksByCategory('feedback');
  }

  get doneTasks() {
    return this.filterTasksByCategory('done');
  }

  private filterTasksByCategory(categoryKey: 'todo' | 'progress' | 'feedback' | 'done') {
    return this.tasks().filter((task) => this.getCategoryKey(task) === categoryKey);
  }

  getNormalizedPriority(priority: string): string {
    return priority.replace(/^\$/, '').trim().toLowerCase();
  }

  private getCategoryKey(task: Task): 'todo' | 'progress' | 'feedback' | 'done' {
    const category = task.category?.toLowerCase().trim() || '';

    if (category.includes('progress')) {
      return 'progress';
    }
    if (category.includes('feedback')) {
      return 'feedback';
    }
    if (category.includes('done')) {
      return 'done';
    }
    return 'todo';
  }

  getTaskCardClass(category: string): string {
    const categoryLower = category?.toLowerCase().trim() || '';
    return categoryLower.includes('technical') ? 'task-card--technical' : 'task-card--user';
  }
}
