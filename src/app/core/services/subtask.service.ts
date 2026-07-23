import { Injectable, inject, computed } from '@angular/core';
import { Supabase } from './supabase';
import { Subtask } from '../../models/subtask.model';

interface subTask {
  title: String;
  is_Done: Boolean;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class SubtaskService {
  db = inject(Supabase);
  subtasks = computed(() => this.db.subtasks());
  subtasksCache: subTask[] = [];

  /**
   * Fetches subtasks linked to given task ID and updates visual checkbox states.
   *
   * @param id - Task ID.
   */
  async getSubTasks(id: number) {
    this.subtasksCache = [];
    for (let index = 0; index < this.subtasks().length; index++) {
      if (this.subtasks()[index].task_id == id) {
        this.subtasksCache.push({
          title: this.subtasks()[index].title,
          is_Done: this.subtasks()[index].is_done,
          id: this.subtasks()[index].id,
        });
      }
    }
    setTimeout(() => {
      this.setCheckBoxState(id);
    }, 0);
  }

  /**
   * Retrieves all subtasks belonging to specified task ID.
   *
   * @param taskId - Task ID.
   * @returns Array of subtasks.
   */
  getSubtaskAmount(taskId: number): Subtask[] {
    return this.subtasks().filter((subtask) => subtask.task_id === taskId);
  }

  /**
   * Counts number of completed subtasks for task.
   *
   * @param taskId - Task ID.
   * @returns Count of completed subtasks.
   */
  getCompletedSubtasksAmount(taskId: number): number {
    const taskSubtasks = this.getSubtaskAmount(taskId);
    return taskSubtasks.filter((subtask) => subtask.is_done).length;
  }

  /**
   * Calculates overall subtask completion percentage for task progress bar.
   *
   * @param taskId - Task ID.
   * @returns Completion percentage between 0 and 100.
   */
  getProgress(taskId: number): number {
    const taskSubtasks = this.getSubtaskAmount(taskId);
    const total = taskSubtasks.length;
    if (total === 0) return 0;
    const completed = taskSubtasks.filter((subtask) => subtask.is_done).length;
    return (completed / total) * 100;
  }

  /**
   * Updates checkbox image source according to subtask completion status.
   *
   * @param taskID - Task ID.
   */
  setCheckBoxState(taskID: number) {
    for (let index = 0; index < this.db.subtasks().length; index++) {
      let targetCheckBox = document.getElementById(
        'checkbox_' + this.db.subtasks()[index].id,
      ) as HTMLImageElement;
      if (
        this.db.subtasks()[index].task_id == taskID &&
        this.db.subtasks()[index].is_done == true
      ) {
        targetCheckBox.src = 'assets/UI/checkbox_selected.png';
      } else if (
        this.db.subtasks()[index].task_id == taskID &&
        this.db.subtasks()[index].is_done == false
      ) {
        targetCheckBox.src = 'assets/UI/checkbox_default.png';
      }
    }
  }
}
