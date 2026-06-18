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

export interface newContact {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  supabaseURL = 'https://voxswosamxhzcmspddjw.supabase.co';
  supabaseKey = 'sb_publishable_dtywlOnyxHoBjKZ9RHogMQ_xa3sIvBC';
  supabase = createClient(this.supabaseURL, this.supabaseKey);

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
}
