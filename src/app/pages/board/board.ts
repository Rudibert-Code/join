import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../core/services/supabase';
import { Task } from '../../models/task.model';
import { Subtask } from '../../models/subtask.model';
import { RouterLink } from '@angular/router';
import { TicketDetails } from '../../components/ticket-details/ticket-details';
import { BoardMobile } from '../../pages/board-mobile/board-mobile';
import { ContactService } from '../../core/services/contact.service';

interface subTask {
  title: String;
  is_Done: Boolean;
  id: number;
}

/**
 * Manages the main kanban board view including drag-and-drop, task status updates, and ticket modal handling.
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TicketDetails, BoardMobile],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  db = inject(Supabase);
  cs = inject(ContactService);
  contacts = computed(() => this.cs.contacts());
  tasks = computed(() => this.db.tasks());
  subtasks = computed(() => this.db.subtasks());
  task_contacts = computed(() => this.db.task_contacts());
  searchQuery: string = '';
  openTicketID: number = 0;
  activeDropZone: string | null = null;

  /**
   * Checks whether the given drop zone ID matches the currently active drop target.
   *
   * @param zone - Drop zone container ID.
   * @returns True if active drop target.
   */
  isDropTarget(zone: string): boolean {
    return this.activeDropZone === zone;
  }

  /**
   * Triggers initial data loading on component initialization.
   */
  ngOnInit() {
    this.loadTasks();
  }

  /**
   * Fetches contacts, tasks, subtasks, and task-contact relations from the database.
   */
  async loadTasks() {
    const contact = await this.db.getContacts();
    const tasks = await this.db.getTasks();
    const subtasks = await this.db.getSubtasks();
    const task_contacts = await this.db.getTaskToContacts();
  }

  /**
   * Retrieves filtered tasks for the 'to_do' column.
   */
  get todoTasks() {
    return this.filterTasksByCategory('to_do');
  }

  /**
   * Retrieves filtered tasks for the 'in_progress' column.
   */
  get progressTasks() {
    return this.filterTasksByCategory('in_progress');
  }

  /**
   * Retrieves filtered tasks for the 'await_feedback' column.
   */
  get feedbackTasks() {
    return this.filterTasksByCategory('await_feedback');
  }

  /**
   * Retrieves filtered tasks for the 'done' column.
   */
  get doneTasks() {
    return this.filterTasksByCategory('done');
  }

  /**
   * Filters tasks by column status key and matches against search query if present.
   *
   * @param categoryKey - Column identifier key.
   * @returns Array of filtered task objects.
   */
  private filterTasksByCategory(categoryKey: 'to_do' | 'in_progress' | 'await_feedback' | 'done') {
    let filtered = this.tasks().filter((task) => this.getCategoryKey(task) === categoryKey);

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query),
      );
    }
    return filtered;
  }

  /**
   * Normalizes raw priority string values.
   *
   * @param priority - Raw priority string.
   * @returns Cleaned priority string.
   */
  getNormalizedPriority(priority: string): string {
    return priority.replace(/^\$/, '').trim().toLowerCase();
  }

  /**
   * Maps task status string to valid category key.
   *
   * @param task - The task object.
   * @returns Category key value.
   */
  private getCategoryKey(task: Task): 'to_do' | 'in_progress' | 'await_feedback' | 'done' {
    const status = task.status?.toLowerCase().trim() || '';

    if (status === 'in_progress') {
      return 'in_progress';
    }
    if (status === 'await_feedback') {
      return 'await_feedback';
    }
    if (status === 'done') {
      return 'done';
    }
    return 'to_do';
  }

  /**
   * Handles dragstart event by attaching task ID to drag payload.
   *
   * @param id - Task ID.
   * @param event - HTML DragEvent.
   */
  startDragging(id: number, event: DragEvent) {
    event.dataTransfer?.setData('text/plain', id.toString());
    const target = event.target as HTMLElement;
    const taskCard = target.closest('.task-card') as HTMLElement;
    if (taskCard) {
      taskCard.classList.add('dragging');
    }
  }

  /**
   * Cleans up dragging SCSS classes and active drop zone state.
   *
   * @param event - HTML DragEvent.
   */
  dragEnd(event: DragEvent) {
    const target = event.target as HTMLElement;
    const taskCard = target.closest('.task-card') as HTMLElement;
    if (taskCard) {
      taskCard.classList.remove('dragging');
    }

    setTimeout(() => {
      if (this.activeDropZone) {
        this.removeDropTargetClass(this.activeDropZone);
        this.activeDropZone = null;
      }
    }, 50);
  }

  /**
   * Handles dragover event over potential drop column.
   *
   * @param zone - Target drop zone ID.
   * @param event - HTML DragEvent.
   */
  dragOver(zone: string, event: DragEvent) {
    event.preventDefault();
    if (this.activeDropZone !== zone) {
      if (this.activeDropZone) {
        this.removeDropTargetClass(this.activeDropZone);
      }
      this.activeDropZone = zone;
    }
  }

  /**
   * Resets drop zone state when mouse drags out of target boundary.
   *
   * @param zone - Drop zone container ID.
   * @param event - HTML DragEvent.
   */
  dragLeave(zone: string, event: DragEvent) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      this.removeDropTargetClass(zone);
      if (this.activeDropZone === zone) {
        this.activeDropZone = null;
      }
    }
  }

  /**
   * Removes SCSS highlight class from drop zone element.
   *
   * @param zone - Container element ID.
   */
  private removeDropTargetClass(zone: string) {
    const container = document.getElementById(zone) as HTMLElement;
    if (container) {
      container.classList.remove('drop-target');
    }
  }

  /**
   * Updates task status in database on drag drop completion.
   *
   * @param status - Target status value.
   * @param event - HTML DragEvent.
   */
  async moveToStatus(status: string, event: DragEvent) {
    event.preventDefault();
    const idStr = event.dataTransfer?.getData('text/plain');

    if (idStr) {
      const id = Number(idStr);
      await this.db.updateTaskStatus(id, status);
      this.loadTasks();
    }

    if (this.activeDropZone) {
      this.removeDropTargetClass(this.activeDropZone);
      this.activeDropZone = null;
    }
  }

  /**
   * Direct status update trigger for mobile interface.
   *
   * @param id - Task ID.
   * @param status - Target status string.
   */
  async mobileMoveToStatus(id: number, status: string) {
    await this.db.updateTaskStatus(id, status);
    this.loadTasks();
  }

  /**
   * Determines card styling SCSS class according to task category.
   *
   * @param category - Category name.
   * @returns SCSS class string.
   */
  getTaskCardClass(category: string): string {
    const categoryLower = category?.toLowerCase().trim() || '';
    return categoryLower.includes('technical') ? 'task-card--technical' : 'task-card--user';
  }

  /**
   * Opens ticket details dialog and populates data for selected task.
   *
   * @param id - Task ID.
   */
  openTicketCard(id: number) {
    const task = this.tasks().find((t) => t.id === id);
    if (!task) return;

    const dialogWindow = document.getElementById('ticket_card') as HTMLDialogElement;

    this.ticketCardID = id;
    this.openTicketID = id;

    this.populateTicketDialog(task);
    this.cs.getContacts(id);
    this.getSubTasks(id);

    dialogWindow.showModal();
  }

  private populateTicketDialog(task: Task) {
    const ticketTitle = document.getElementById('ticket_title') as HTMLHeadingElement;
    const ticketDescription = document.getElementById('ticket_description') as HTMLParagraphElement;
    const ticketDueDate = document.getElementById('ticket_due-date') as HTMLParagraphElement;
    const ticketPriority = document.getElementById('ticket_priority') as HTMLParagraphElement;
    const ticketCategory = document.getElementById('ticket_category') as HTMLParagraphElement;

    ticketTitle.textContent = this.cutInout(task.title, 'title');
    ticketDescription.textContent = this.cutInout(task.description, 'description');
    ticketDueDate.textContent = String(this.setTicketDueDate(task.due_date));
    ticketPriority.textContent = task.priority;
    ticketCategory.textContent = task.category;

    this.setTicketPrioIcon(task.priority);
    this.setTicketCatClass(task.category);
  }

  /**
   * Truncates title or description text strings exceeding display length limits.
   *
   * @param text - Text string to trim.
   * @param type - Field type ('title' or 'description').
   * @returns Truncated string with ellipsis if necessary.
   */
  cutInout(text: string, type: string) {
    let newString: string = '';

    if (text.length >= 17 && type == 'title') {
      newString = text.slice(0, 14).concat('...');
    } else if (text.length >= 60 && type == 'description') {
      newString = text.slice(0, 60).concat('...');
    } else {
      newString = text;
    }
    return newString;
  }

  ticketCardID: number = 0;
  newDialogEditTitle: string = '';
  newDialogDescription: string = '';
  newDialogDueDate: string = '';


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
   * Sets category badge style class on ticket element.
   *
   * @param cat - Category name string.
   */
  setTicketCatClass(cat: string) {
    let className: string = '';
    let targetParagraph = document.getElementById('ticket_category') as HTMLParagraphElement;
    targetParagraph.classList.remove('task-card--technical', 'task-card--user');

    switch (cat) {
      case 'Technical Tasks':
        className = 'task-card--technical';
        break;
      default:
        className = 'task-card--user';
        break;
    }
    targetParagraph.classList.add(className);
  }

  /**
   * Formats ISO date hyphens into slashes for UI presentation.
   *
   * @param date - Date string.
   * @returns Formatted date string.
   */
  setTicketDueDate(date: string) {
    return date.replaceAll('-', '/');
  }

  /**
   * Updates ticket priority icon image source based on priority level.
   *
   * @param prio - Priority string.
   */
  setTicketPrioIcon(prio: string) {
    let ticketPrioIcon = document.getElementById('prio-icon') as HTMLImageElement;
    let iconURL: string = '';
    switch (prio) {
      case 'urgent':
        iconURL = 'assets/UI/icon_prio-urgent.png';
        break;
      case 'low':
        iconURL = 'assets/UI/icon_prio-low.png';
        break;
      default:
        iconURL = 'assets/UI/icon_prio-medium.png';
        break;
    }
    ticketPrioIcon.src = iconURL;
  }

  /**
   * Closes active ticket dialogs and saves assigned contacts if changes occurred.
   *
   * @param changes - Flag indicating whether changes were made.
   */
  closeTicketCard(changes: boolean) {
    let dialogWindow = document.getElementById('ticket_card') as HTMLDialogElement;
    let dialogEdit = document.getElementById('ticket_edit') as HTMLDialogElement;
    dialogWindow.close();
    dialogEdit.close();
    if (changes == true) {
      this.cs.assignContactsToTask(this.openTicketID, this.cs.ddContacts);
    }
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
}
