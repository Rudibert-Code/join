import { Injectable, signal } from '@angular/core';
import { createClient, User as SupabaseUser } from '@supabase/supabase-js';

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  color: string;
}

export interface newContact {
  first_name: string;
  last_name: string;
  phone?: string;
  email: string;
  color?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  category: string;
  status: string;
}

export interface NewTask {
  title: string;
  description: string | null;
  due_date: string;
  priority: string;
  category: string;
  status: string;
}

export interface Subtask {
  id: number;
  task_id: number;
  title: string;
  is_done: boolean;
  created_at: string;
}

export interface NewSubtask {
  task_id: number;
  title: string;
  is_done: boolean;
}

export interface TaskContacts {
  task_id: number;
  contact_id: number;
}

export interface User {
  id: number;
  created_at: string;
  contact_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  supabaseURL = 'https://voxswosamxhzcmspddjw.supabase.co';
  supabaseKey = 'sb_publishable_dtywlOnyxHoBjKZ9RHogMQ_xa3sIvBC';
  supabase = createClient(this.supabaseURL, this.supabaseKey);

  tasks = signal<Task[]>([]);
  subtasks = signal<Subtask[]>([]);
  contacts = signal<Contact[]>([]);
  task_contacts = signal<TaskContacts[]>([]);
  today = new Date().toISOString().split('T')[0];
  authUser = signal<SupabaseUser | null>(null);
  isGuest = signal(false);
  authReady = signal(false);
  private authInitPromise: Promise<void> | null = null;

  isLoggedIn() {
    return !!this.authUser() || this.isGuest();
  }

  async ensureAuthLoaded() {
    if (!this.authInitPromise) {
      this.authInitPromise = this.initAuth();
    }
    await this.authInitPromise;
  }

  async initAuth() {
    if (this.authReady()) {
      return;
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    this.authUser.set(user);
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.authUser.set(session?.user ?? null);
      if (session?.user) {
        this.isGuest.set(false);
      }
    });
    this.authReady.set(true);
  }

  async getContacts() {
    const { data: contacts, error } = await this.supabase
      .from('contacts')
      .select('id, first_name, last_name, phone, email, color')
      .order('first_name', { ascending: true });
    if (error) {
      console.error('Supabase getContacts error', error);
      return;
    }
    if (!contacts) {
      this.contacts.set([]);
      return;
    }
    this.contacts.set(contacts);
  }

  async setContact(newContact: newContact) {
    const { data, error } = await this.supabase.from('contacts').insert([newContact]).select();
    if (data) {
      await this.getContacts();
    }
    return data;
  }

  async updateContact(id: number, updatedContact: Partial<Contact>) {
    const { data, error } = await this.supabase
      .from('contacts')
      .update(updatedContact)
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateContact error', error);
      return;
    }
    await this.getContacts();
    return data;
  }

  async deleteContact(id: number) {
    const { error } = await this.supabase.from('contacts').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteContact error', error);
      return;
    }
    await this.getContacts();
  }

  async sortContact() {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .order('first_name', { ascending: false });
  }

  async getContactById(contactId: number) {
    const { data, error } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async getTasks() {
    const { data: tasks, error } = await this.supabase
      .from('tasks')
      .select('id, title, description, due_date, priority, category, status')
      .order('title', { ascending: true });
    if (error) {
      console.error('Supabase getTasks error', error);
      this.tasks.set([]);
      return [];
    }
    if (!tasks) {
      this.tasks.set([]);
      return [];
    }
    this.tasks.set(tasks);
    return tasks;
  }

  async deleteTask(id: number) {
    const { error } = await this.supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteTask error', error);
      return;
    }
    await this.getTasks();
  }

  async deleteSubtask(id: number) {
    const { error } = await this.supabase.from('subtasks').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteSubtask error', error);
      return;
    }
    await this.getSubtasks();
  }

  async getSubtasks() {
    const { data: subtasks, error } = await this.supabase
      .from('subtasks')
      .select('id,task_id,title,is_done,created_at')
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Supabase getSubtasks error', error);
      this.subtasks.set([]);
      return [];
    }
    if (!subtasks) {
      this.subtasks.set([]);
      return [];
    }
    this.subtasks.set(subtasks);
    return subtasks;
  }

  async getTaskToContacts() {
    const { data: task_contacts, error } = await this.supabase
      .from('task_contacts')
      .select('task_id,contact_id');
    if (error) {
      console.error('Supabase getTaskToContacts error', error);
      this.task_contacts.set([]);
      return [];
    }
    if (!task_contacts) {
      this.task_contacts.set([]);
      return [];
    }
    this.task_contacts.set(task_contacts);
    return task_contacts;
  }

  async addTaskContacts(taskContacts: TaskContacts[]) {
    if (taskContacts.length === 0) {
      return [];
    }
    const { data, error } = await this.supabase.from('task_contacts').insert(taskContacts).select();
    if (error) {
      console.error('Supabase addTaskContacts error', error);
      return;
    }
    await this.getTaskToContacts();
    return data;
  }

  async addTask(newTask: NewTask) {
    const { data, error } = await this.supabase.from('tasks').insert([newTask]).select().single();
    if (error) {
      console.error('Supabase addTask error', error);
      return;
    }
    await this.getTasks();
    return data;
  }

  async addSubtasks(newSubtasks: NewSubtask[]) {
    if (newSubtasks.length === 0) {
      return [];
    }
    const { data, error } = await this.supabase.from('subtasks').insert(newSubtasks).select();
    if (error) {
      console.error('Supabase addSubtasks error', error);
      return;
    }
    await this.getSubtasks();
    return data;
  }

  async updateSubtasks(id: number, is_done: boolean) {
    const { data, error } = await this.supabase
      .from('subtasks')
      .update({ is_done })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase uupdatedSubtask error', error);
      return;
    }
    return data;
  }

  async updateTaskStatus(id: number, status: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateTaskStatus error', error);
      return;
    }
    return data;
  }

  async updateTaskPrio(id: number, priority: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ priority })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateTaskPrio error', error);
      return;
    }
    return data;
  }

  async updateTaskTitle(id: number, title: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ title })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateTaskPrio error', error);
      return;
    }
    return data;
  }

  async updateTaskDescription(id: number, description: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ description })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateTaskPrio error', error);
      return;
    }
    return data;
  }

  async updateTaskDueDate(id: number, due_date: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ due_date })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateTaskPrio error', error);
      return;
    }
    return data;
  }

  async signUpWithEmail(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (data.user) {
      this.authUser.set(data.user);
      this.isGuest.set(false);
    }
    return { data, error };
  }

  signInAsGuest() {
    this.authUser.set(null);
    this.isGuest.set(true);
    this.authReady.set(true);
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.authUser.set(null);
    this.isGuest.set(false);
  }

  async getCurrentUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }
}
