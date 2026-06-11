import { NgSwitchCase } from '@angular/common';
import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'

interface Contact{
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
}


@Injectable({
  providedIn: 'root',
})
export class Supabase {
supabaseURL = 'https://voxswosamxhzcmspddjw.supabase.co'
supabaseKey = 'sb_publishable_dtywlOnyxHoBjKZ9RHogMQ_xa3sIvBC'
supabase = createClient(this.supabaseURL, this.supabaseKey)

contacts = signal<Contact[]>([])

// read all contacts and set it 
  async getContacts() {
    const { data: contacts, error } = await this.supabase
      .from('contacts')
      .select('first_name, last_name, phone, email')

    if (error) {
      console.error('Supabase getContacts error', error)
      return
    }

    if (!contacts) {
      this.contacts.set([])
      return
    }

    this.contacts.set(contacts)
  }

// create an contact
  async setContact(newContact: Contact) {
    const { data, error } = await this.supabase
      .from('contacts')
      .insert([newContact])
      .select()
    if (data) {
      await this.getContacts()
    }
    return data
  }

// update contacts

async updateContact(id:number) {
  const { data, error } = await this.supabase
  .from('contacts')
  .update({ first_name: '', last_name: '', phone: '', email: '' })
  .eq('id', id)
  .select()
}

// delete contact

async deleteContact(id:number) {
  const { error } = await this.supabase
  .from('contacts')
  .delete()
  .eq('id', id)        
  }
}
