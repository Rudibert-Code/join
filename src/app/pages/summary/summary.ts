import { DatePipe } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { Supabase } from '../../supabase';
import { Task } from '../../supabase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
  standalone: true,
  imports: [DatePipe],
})
export class Summary {
  db = inject(Supabase);
  tasks = computed(() => this.db.tasks());
  router = inject(Router);
  deadline: Date = new Date();
  displayName: string = 'Guest';

  constructor() {
    this.deadline.setDate(this.deadline.getDate() + 5);
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation?.extras.state && currentNavigation.extras.state['userName']) {
      this.displayName = currentNavigation.extras.state['userName'];
    }
  }
  
  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    await this.db.getTasks();
  }

  get todoTasks() {
    return this.tasks().filter((task) => this.getStatus(task) === 'to_do');
  }

  get progressTasks() {
    return this.tasks().filter((task) => this.getStatus(task) === 'in_progress');
  }

  get feedbackTasks() {
    return this.tasks().filter((task) => this.getStatus(task) === 'await_feedback');
  }

  get doneTasks() {
    return this.tasks().filter((task) => this.getStatus(task) === 'done');
  }

  private getStatus(task: Task): string {
    return task.status?.toLowerCase().trim() || 'to_do';
  }
}
