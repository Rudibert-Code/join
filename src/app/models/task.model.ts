/**
 * Represents a task item retrieved from the database.
 */

export interface Task {
  /** Unique database ID of the task. */
  id: number;
  /** Title of the task. */
  title: string;
  /** Detailed description of the task. */
  description: string;
  /** Target due date (ISO string YYYY-MM-DD). */
  due_date: string;
  /** Priority level (e.g., 'urgent', 'medium', 'low'). */
  priority: string;
  /** Category of the task (e.g., 'Technical Tasks'). */
  category: string;
  /** Current Kanban column status (e.g., 'to-do', 'in-progress'). */
  status: string;
}

/**
 * Payload interface required to create a new task record.
 */

export interface NewTask {
  /** Title of the new task. */
  title: string;
  /** Optional description or null. */
  description: string | null;
  /** Target completion date. */
  due_date: string;
  /** Priority classification. */
  priority: string;
  /** Category group name. */
  category: string;
  /** Initial status column. */
  status: string;
}