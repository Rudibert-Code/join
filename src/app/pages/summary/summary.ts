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
  displayName: string = 'Guest';

  constructor() {
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

  get upcomingDeadline(): Date | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDeadlines = this.tasks()
      .map((task) => new Date(`${task.due_date}T00:00:00`))
      .filter((date) => !isNaN(date.getTime()) && date >= today)
      .sort((a, b) => a.getTime() - b.getTime());

    return futureDeadlines[0] || null;
  }

  private getStatus(task: Task): string {
    return task.status?.toLowerCase().trim() || 'to_do';
  }
}
