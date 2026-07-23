import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { Contact, NewContact, TaskContacts } from '../../models/contact.model';
import { Task, NewTask } from '../../models/task.model';
import { Subtask, NewSubtask } from '../../models/subtask.model';

/**
 * Service facilitating database interactions
 * and global reactive state management via Supabase backend.
 */
@Injectable({
  providedIn: 'root',
})
export class Supabase {
  /** Base URL for the target Supabase project instance. */
  supabaseURL = 'https://voxswosamxhzcmspddjw.supabase.co';
  /** Anonymous/Publishable public API key for Supabase access. */
  supabaseKey = 'sb_publishable_dtywlOnyxHoBjKZ9RHogMQ_xa3sIvBC';
  /** Initialized Supabase JS client instance. */
  supabase = createClient(this.supabaseURL, this.supabaseKey);

  /** Signal holding the array of active tasks. */
  tasks = signal<Task[]>([]);
  /** Signal holding the list of all subtasks across tasks. */
  subtasks = signal<Subtask[]>([]);
  /** Signal holding the current contact records. */
  contacts = signal<Contact[]>([]);
  /** Signal holding task-to-contact relation mappings. */
  task_contacts = signal<TaskContacts[]>([]);
  /** Current date string formatted as YYYY-MM-DD for datepicker defaults. */
  today = new Date().toISOString().split('T')[0];

  /**
   * Fetches all contacts from database ordered by first name and updates state signal.
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

  /**
   * Inserts a new contact into the database and refreshes local contact state.
   *
   * @param newContact - The contact payload object to create.
   * @returns Inserted contact database row object.
   */
  async setContact(newContact: NewContact) {
    const { data, error } = await this.supabase.from('contacts').insert([newContact]).select();
    if (data) {
      await this.getContacts();
    }
    return data;
  }

  /**
   * Updates an existing contact record in the database.
   *
   * @param id - Unique contact record ID.
   * @param updatedContact - Object containing modified fields.
   * @returns Updated database record array or void on failure.
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

  /**
   * Removes a contact record from the database by ID.
   *
   * @param id - Target contact ID for deletion.
   */
  async deleteContact(id: number) {
    const { error } = await this.supabase.from('contacts').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteContact error', error);
      return;
    }
    await this.getContacts();
  }

  /**
   * Fetches a specific contact record from database matching the given ID.
   *
   * @param contactId - Target contact ID.
   * @returns Single contact object payload.
   */
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

  /**
   * Retrieves all tasks ordered by title and updates the task signal state.
   *
   * @returns Array of tasks retrieved.
   */
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

  /**
   * Deletes a task record from database and updates cached tasks.
   *
   * @param id - Task ID to remove.
   */
  async deleteTask(id: number) {
    const { error } = await this.supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteTask error', error);
      return;
    }
    await this.getTasks();
  }

  /**
   * Deletes a subtask record from database and updates subtask state.
   *
   * @param id - Subtask ID to remove.
   */
  async deleteSubtask(id: number) {
    const { error } = await this.supabase.from('subtasks').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteSubtask error', error);
      return;
    }
    await this.getSubtasks();
  }

  /**
   * Retrieves all subtasks from database ordered by creation date.
   *
   * @returns Array of all retrieved subtasks.
   */
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

  /**
   * Fetches task-to-contact relation mappings.
   *
   * @returns Array of relation objects.
   */
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

  /**
   * Assigns contacts to a task by creating junction entries.
   *
   * @param taskContacts - Array of task-contact relation pairs.
   * @returns Inserted relation records.
   */
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

  /**
   * Inserts a primary task record into database and updates local task list.
   *
   * @param newTask - New task data structure.
   * @returns Single created task record object.
   */
  async addTask(newTask: NewTask) {
    const { data, error } = await this.supabase.from('tasks').insert([newTask]).select().single();
    if (error) {
      console.error('Supabase addTask error', error);
      return;
    }
    await this.getTasks();
    return data;
  }

  /**
   * Inserts multiple subtasks linked to a task into the database.
   *
   * @param newSubtasks - List of subtask payload items.
   * @returns Array of created subtasks.
   */
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

  /**
   * Updates completion status flag for a subtask.
   *
   * @param id - Target subtask ID.
   * @param is_done - New completion state.
   * @returns Updated subtask payload.
   */
  async updateSubtasks(id: number, is_done: boolean) {
    const { data, error } = await this.supabase
      .from('subtasks')
      .update({ is_done })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateSubtasks error', error);
      return;
    }
    return data;
  }

  /**
   * Updates the column status (e.g. 'to-do', 'done') of a specific task.
   *
   * @param id - Target task ID.
   * @param status - New status string.
   * @returns Updated task record.
   */
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

  /**
   * Updates task priority level.
   *
   * @param id - Target task ID.
   * @param priority - Priority classification value.
   * @returns Updated task record.
   */
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

  /**
   * Updates the title property of a task.
   *
   * @param id - Target task ID.
   * @param title - New title text.
   * @returns Updated task record.
   */
  async updateTaskTitle(id: number, title: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ title })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateTaskTitle error', error);
      return;
    }
    return data;
  }

  /**
   * Updates the description of a task.
   *
   * @param id - Target task ID.
   * @param description - New description text.
   * @returns Updated task record.
   */
  async updateTaskDescription(id: number, description: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ description })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateTaskDescription error', error);
      return;
    }
    return data;
  }

  /**
   * Updates the due date of a task.
   *
   * @param id - Target task ID.
   * @param due_date - Target date string formatted as YYYY-MM-DD.
   * @returns Updated task record.
   */
  async updateTaskDueDate(id: number, due_date: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .update({ due_date })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Supabase updateTaskDueDate error', error);
      return;
    }
    return data;
  }
}