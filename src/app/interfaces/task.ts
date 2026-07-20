/**
 * Represents a task entity with title, metadata, assigned contacts, and subtasks.
 */
export interface Task {
  /** Optional unique identifier assigned by the database. */
  id?: number;
  /** Title or headline of the task. */
  title: string;
  /** Detailed description of the task requirements. */
  description: string;
  /** Due date formatted as an ISO string (DD-MM-YYYY). */
  due_date: string;
  /** Priority level of the task. */
  priority: 'urgent' | 'medium' | 'low';
  /** Classification category of the task. */
  category: 'Technical Tasks' | 'User Story';
  /** Array of contact IDs assigned to this task. */
  assignedContactIds: number[];
  /** List of subtask title strings. */
  subtasks: string[];
}