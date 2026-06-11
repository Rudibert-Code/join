import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'


@Injectable({
  providedIn: 'root',
})
export class Supabase {
supabaseURL = 'https://voxswosamxhzcmspddjw.supabase.co'
supabaseKey = 'sb_publishable_dtywlOnyxHoBjKZ9RHogMQ_xa3sIvBC'
supabase = createClient(this.supabaseURL, this.supabaseKey)

contacts = signal<{firstname:string, lastname:string, phone:string, email:string}[]>([])

// read all contacts and set it 
  async getContacts() {
    let { data: contacts, error } = await this.supabase
  .from('contacts')
  .select('firstname, lastname, phone, email')
  if(!contacts) return
  this.contacts.set(contacts)
  }

// create an contact
  async setContact(contacts:{ firstname:string, lastname:string, phone:string, email:string }) {
    const { data, error } = await this.supabase
  .from('contacts')
  .insert([
    { contacts },
  ])
  .select()
  }

// update contacts

async updateContact(id:number) {
  const { data, error } = await this.supabase
  .from('contacts')
  .update({ firstname: '', lastname: '', phone: '', email: '' })
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
