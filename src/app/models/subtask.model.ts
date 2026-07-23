/**
 * Represents a subtask associated with a parent task.
 */

export interface Subtask {
  /** Unique database ID of the subtask. */
  id: number;
  /** Database ID of the associated parent task. */
  task_id: number;
  /** Subtask title or description. */
  title: string;
  /** Completion flag. */
  is_done: boolean;
  /** Creation timestamp string. */
  created_at: string;
}

/**
 * Payload interface required to create a new subtask record.
 */

export interface NewSubtask {
  /** Database ID of the target parent task. */
  task_id: number;
  /** Title of the subtask item. */
  title: string;
  /** Initial completion state. */
  is_done: boolean;
}
