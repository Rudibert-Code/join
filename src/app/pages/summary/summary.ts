import { DatePipe } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { Supabase } from '../../supabase';
import { Task } from '../../supabase';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { User as SupabaseUser } from '@supabase/supabase-js';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
  standalone: true,
  imports: [DatePipe, RouterLink],
})
export class Summary {
  db = inject(Supabase);
  tasks = computed(() => this.db.tasks());
  router = inject(ActivatedRoute);
  deadline: Date = new Date();
  displayName: string = '';
  greetingText: string = '';
  showGreetingIntro = false;
  private shouldPlayGreetingIntro = false;

  constructor() {
    this.deadline.setDate(this.deadline.getDate() + 5);
    const state = window.history.state;

    if (state && state.firstName) {
      this.displayName = state.lastName ? `${state.firstName} ${state.lastName}` : state.firstName;
    } else if (state && state.userName) {
      this.displayName = state.userName;
    }

    this.shouldPlayGreetingIntro = !!state?.playGreetingIntro;
    this.showGreetingIntro = this.shouldPlayGreetingIntro;
  }

  async ngOnInit() {
    this.getGreetingText();
    await this.getDisplayName();
    this.showGreetingIntro = this.shouldPlayGreetingIntro;
    this.loadTasks();
  }

  async loadTasks() {
    await this.db.getTasks();
  }

  async getDisplayName() {
    if (this.db.isGuest()) {
      this.displayName = 'Guest';
      return;
    }

    const authUser = this.db.authUser();
    if (authUser) {
      this.displayName = this.getUserDisplayName(authUser);
      return;
    }

    try {
      const {
        data: { user },
      } = await this.db.supabase.auth.getUser();
      this.displayName = user ? this.getUserDisplayName(user) : 'Guest';
    } catch (error) {
      this.displayName = 'Guest';
    }
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

  get urgentTasks() {
    return this.tasks().filter((task) => this.getPriority(task) === 'urgent');
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
  private getPriority(task: Task): string {
    return task.priority?.toLowerCase().trim() || 'urgent';
  }

  private getUserDisplayName(user: SupabaseUser): string {
    const firstName = user.user_metadata?.['first_name'];
    const lastName = user.user_metadata?.['last_name'];
    return [firstName, lastName].filter(Boolean).join(' ') || user.email || 'Guest';
  }
}
