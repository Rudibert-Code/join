import { Injectable, inject, computed } from '@angular/core';
import { Supabase } from './supabase';
import { Board } from '../../pages/board/board';

interface contacts {
  id: number;
  name: string;
  surname: string;
  initials: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private db = inject(Supabase);
  contacts = computed(() => this.db.contacts());
  task_contacts = computed(() => this.db.task_contacts());

  contactsCache: contacts[] = [];
  ddContacts: number[] = [];

  /**
   * Maps contact details and avatar styles for rendering on board task card preview.
   *
   * @param taskId - Task ID.
   * @returns Array of contact initial and color objects.
   */
  getContactsForTaskcard(taskId: number) {
    const allContacts = this.contacts();
    const relationContacts = this.task_contacts();
    const matchedContacts = [];
    for (const relation of relationContacts) {
      if (relation.task_id === taskId) {
        const contact = allContacts.find((contact) => contact.id === relation.contact_id);
        if (contact) {
          matchedContacts.push({
            initials: `${contact.first_name.charAt(0).toUpperCase()}${contact.last_name.charAt(0).toUpperCase()}`,
            color: contact.color.startsWith('#') ? contact.color : `#${contact.color}`,
          });
        }
      }
    }
    return matchedContacts;
  }

  /**
   * Maps contact IDs to task-contact relationship payload objects.
   *
   * @param taskId - Task ID.
   * @param contactIds - Array of contact IDs.
   * @returns Array of relation objects.
   */
  buildTaskContacts(taskId: number, contactIds: number[]) {
    return contactIds.map((contactId) => ({
      task_id: taskId,
      contact_id: contactId,
    }));
  }

  /**
   * Assigns array of contact IDs to task record in database.
   *
   * @param taskId - Task ID.
   * @param contactIds - Array of contact IDs.
   */
  async assignContactsToTask(taskId: number, contactIds: number[]) {
    this.filterContacts(taskId);
    const taskContacts = this.buildTaskContacts(taskId, contactIds);
    await this.db.addTaskContacts(taskContacts);
  }

  /**
   * Removes assigned contact entries for task from dropdown cache array.
   *
   * @param taskID - Task ID.
   */
  filterContacts(taskID: number) {
    let entryCounter: number = 0;
    for (let index = 0; index < this.db.task_contacts().length; index++) {
      if (this.db.task_contacts()[index].task_id == taskID) {
        entryCounter++;
      }
    }
    this.ddContacts.splice(0, entryCounter);
  }

  /**
   * Populates cached contact details linked to specified task ID.
   *
   * @param id - Task ID.
   */
  async getContacts(id: number) {
    const relations = this.getTaskContactRelations(id);
    this.contactsCache = this.mapContactsToCache(relations);
  }

  /**
   * Maps task-contact relations to the contact cache format used by the board UI.
   *
   * @param relations - Task-contact relation objects.
   * @returns Array of cached contact details.
   */
  private mapContactsToCache(relations: { task_id: number; contact_id: number }[]) {
    const linkedContacts = this.contacts();

    return relations
      .map((relation) => linkedContacts.find((contact) => contact.id === relation.contact_id))
      .filter((contact): contact is (typeof linkedContacts)[number] => Boolean(contact))
      .map((contact) => ({
        id: Number(contact.id),
        name: String(contact.first_name),
        surname: String(contact.last_name),
        initials: `${contact.first_name.charAt(0).toUpperCase()}${contact.last_name.charAt(0).toUpperCase()}`,
        color: String(contact.color),
      }));
  }

  /**
   * Retrieves all task-contact relations that belong to the provided task ID.
   *
   * @param id - Task ID.
   * @returns Matching task-contact relation objects.
   */
  private getTaskContactRelations(id: number) {
    return this.task_contacts().filter((relation) => relation.task_id === id);
  }
}
