import { Injectable, signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'


@Injectable({
  providedIn: 'root',
})
export class Supabase {
supabaseURL = 'https://voxswosamxhzcmspddjw.supabase.co'
supabaseKey = 'sb_publishable_dtywlOnyxHoBjKZ9RHogMQ_xa3sIvBC'
supabase = createClient(this.supabaseURL, this.supabaseKey)

contacts = signal<{id:number, created_at:string, firstname:string, lastname:string, phone:string, email:string}[]>([])

  async getContacts() {
    let { data: contacts, error } = await this.supabase
  .from('contacts')
  .select('*')
  if(!contacts) return
  this.contacts.set(contacts)
  }
}
