import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

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
  phone: string;
  email: string;
  color: string;
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

export interface Subtask {
  id: number;
  task_id: number;
  title: string;
  is_done: string;
  created_at: string;
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

  /*
   * this function read all contacts from the db and set it
   */
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

  /*
   * this function set the data in the Contactlist Component
   */
  async setContact(newContact: newContact) {
    const { data, error } = await this.supabase.from('contacts').insert([newContact]).select();
    if (data) {
      await this.getContacts();
    }
    return data;
  }

  /*
   * this function update the db with the form (edit)
   *
   * @param {number} id - This is the id you want to change the properties
   */
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

  /*
   * this function delete the id in the db
   *
   * @param {number} id - This is the id you want to delete
   */
  async deleteContact(id: number) {
    const { error } = await this.supabase.from('contacts').delete().eq('id', id);

    if (error) {
      console.error('Supabase deleteContact error', error);
      return;
    }

    await this.getContacts();
  }

  /*
   * this function sort the data in the Contactlist Component
   */
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
}
