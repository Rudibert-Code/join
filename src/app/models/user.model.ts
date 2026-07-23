/**
 * Represents user profile data stored in the application database.
 */

export interface User {
  /** Unique user database ID. */
  id: number;
  /** Account creation timestamp. */
  created_at: string;
  /** Associated contact record ID if available. */
  contact_id: number | null;
  /** First name of the registered user. */
  first_name: string;
  /** Last name of the registered user. */
  last_name: string;
  /** Account login email. */
  email: string;
  /** Hashed password. */
  password: string;
}
