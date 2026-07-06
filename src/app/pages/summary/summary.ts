import { DatePipe } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { Supabase } from '../../supabase';
import { Task } from '../../supabase';
import { Router, ActivatedRoute } from '@angular/router';

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
  router = inject(ActivatedRoute);
  deadline: Date = new Date();
  displayName: string = '';
  greetingText: string = '';

  constructor() {
    this.deadline.setDate(this.deadline.getDate() + 5);
    const state = window.history.state;

    if (state && state.firstName) {
      this.displayName = state.lastName ? `${state.firstName} ${state.lastName}` : state.firstName;
    }
  }

  async ngOnInit() {
    try {
      const {
        data: { user },
      } = await this.db.supabase.auth.getUser();
      if (user && user.user_metadata) {
        const firstName = user.user_metadata['first_name'];
        const lastName = user.user_metadata['last_name'];
        this.displayName = `${firstName} ${lastName}`;
      } else {
        this.displayName = 'Guest';
      }
    } catch (error) {
      this.displayName = 'Guest';
    }
    this.loadTasks();
    this.getGreetingText()
  }

  async loadTasks() {
    await this.db.getTasks();
  }

  async getGreetingText() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 11) {
      this.greetingText = 'Good morning,';
    } else if (currentHour >= 11 && currentHour < 18) {
      this.greetingText = 'Good afternoon,';
    } else if (currentHour >= 18 && currentHour < 21) {
      this.greetingText = 'Good evening,';
    } else {
      this.greetingText = 'Good night,';
    }
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
