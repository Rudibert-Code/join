/**
 * Represents an existing contact stored in the database.
 */

export interface Contact {
  /** Unique database ID of the contact. */
  id: number;
  /** First name of the contact. */
  first_name: string;
  /** Last name of the contact. */
  last_name: string;
  /** Phone number of the contact. */
  phone: string;
  /** Primary email address of the contact. */
  email: string;
  /** SCSS color string associated with the contact badge. */
  color: string;
}

/**
 * Payload interface required to create a new contact record.
 */

export interface NewContact {
  /** First name of the new contact. */
  first_name: string;
  /** Last name of the new contact. */
  last_name: string;
  /** Optional phone number. */
  phone?: string;
  /** Primary email address. */
  email: string;
  /** Optional color identifier. */
  color?: string;
}

/**
 * Junction table interface linking tasks to assigned contacts.
 */

export interface TaskContacts {
  /** Database ID of the assigned task. */
  task_id: number;
  /** Database ID of the assigned contact. */
  contact_id: number;
}
