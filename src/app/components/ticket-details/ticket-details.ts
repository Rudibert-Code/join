import { Component, inject } from '@angular/core';
import { Board } from '../../pages/board/board';
import { TicketEdit } from '../../components/ticket-edit/ticket-edit';

/**
 * Represents a subtask item within the ticket detail view.
 */
interface subTask {
  /** The text content of the subtask. */
  title: String;
  /** Completion status of the subtask. */
  is_Done: Boolean;
  /** Unique database identifier for the subtask. */
  id: number;
}

/**
 * Represents a contact mapped for display within ticket details.
 */
interface contacts {
  /** Contact ID. */
  id: number;
  /** Contact first name. */
  name: string;
  /** Contact last name. */
  surname: string;
  /** Calculated uppercase initials (e.g. "JD"). */
  initials: string;
  /** Hex color code (without '#' prefix). */
  color: string;
}

/**
 * Structure used for adding new subtasks.
 */
interface newSubTask {
  /** Target task ID. */
  task_id: number;
  /** Title of the new subtask. */
  title: string;
  /** Initial completion state. */
  is_done: boolean;
}

/**
 * Handles displaying detailed view of a selected task/ticket inside a modal overlay.
 */
@Component({
  selector: 'app-ticket-details',
  imports: [TicketEdit],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.scss',
})

export class TicketDetails {
  /** Reference to parent Board component instance. */
  board = inject(Board);
  taskTitle: string = '';
  taskDescr: string = '';
  taskLimitDate: string = '';
  taskPriority: string = '';
  taskCategory: string = '';
  searchQuery: string = '';
  openTicketID: number = 0;
  ticketCardID: number = 0;
  newDialogEditTitle: string = '';
  newDialogDescription: string = '';
  newDialogDueDate: string = '';

  /**
   * Closes the details modal and opens the edit modal pre-filled with current task values.
   */
  openTicketEdit() {
    const dialogEdit = document.getElementById('ticket_edit') as HTMLDialogElement;
    const dialogEditTitle = document.getElementById('editTaskTitle') as HTMLInputElement;
    const dialogEditDescription = document.getElementById('editTaskDescription',) as HTMLInputElement;
    const dialogEditDueDate = document.getElementById('subtask_edit_dd') as HTMLInputElement;
    let dialogPrio: string = '';

    for (let index = 0; index < this.board.tasks().length; index++) {

      if (this.board.tasks()[index].id == this.board.ticketCardID) {
        dialogEditTitle.value = this.board.tasks()[index].title;
        dialogEditDescription.value = this.board.tasks()[index].description;
        dialogEditDueDate.value = this.board.tasks()[index].due_date;
        dialogPrio = this.board.tasks()[index].priority;
      }
    }

    this.board.closeTicketCard(false);
    this.editTicketPrio(dialogPrio);
    this.board.setContactColor(this.ticketCardID);
    dialogEdit.showModal();
  }

  /**
   * Updates task priority visual style classes and persists change to database.
   *
   * @param newPrio - Priority string identifier ('urgent', 'medium', or 'low').
   */
  editTicketPrio(newPrio: string) {
    const iconUrgent = document.getElementById('edit_prio_urgent') as HTMLButtonElement;
    const iconMedium = document.getElementById('edit_prio_medium') as HTMLButtonElement;
    const iconLow = document.getElementById('edit_prio_low') as HTMLButtonElement;
    iconUrgent.classList.remove('edit_prio_urgent');
    iconMedium.classList.remove('edit_prio_medium');
    iconLow.classList.remove('edit_prio_low');
    switch (newPrio) {
      case 'urgent':
        iconUrgent.classList.add('edit_prio_urgent');
        break;
      case 'medium':
        iconMedium.classList.add('edit_prio_medium');
        break;
      case 'low':
        iconLow.classList.add('edit_prio_low');
        break;
    }
    this.board.db.updateTaskPrio(this.ticketCardID, newPrio);
  }

  contactsCache: contacts[] = [];

  /**
   * Populates contacts cache for the selected task ID.
   *
   * @param id - Task ID.
   */
  async getContacts(id: number) {
    this.contactsCache = [];
    const linkedContacts = this.board.contacts();
    for (const relation of this.board.task_contacts()) {

      if (relation.task_id !== id) {
        continue;
      }

      const matchingContact = linkedContacts.find((contact) => contact.id === relation.contact_id);

      if (!matchingContact) {
        continue;
      }

      this.contactsCache.push({
        id: Number(matchingContact.id),
        name: String(matchingContact.first_name),
        surname: String(matchingContact.last_name),
        initials: `${matchingContact.first_name.charAt(0).toUpperCase()}${matchingContact.last_name.charAt(0).toUpperCase()}`,
        color: String(matchingContact.color.slice(1)),
      });
    }
  }

  subtasksCache: subTask[] = [];

  /**
   * Populates subtasks cache for the selected task ID.
   *
* @param id - Unique database ID of the task.
   */
  async getSubTasks(id: number) {
    this.subtasksCache = [];

    for (let index = 0; index < this.board.subtasks().length; index++) {

      if (this.board.subtasks()[index].task_id == id) {
        this.subtasksCache.push({
          title: this.board.subtasks()[index].title,
          is_Done: this.board.subtasks()[index].is_done,
          id: this.board.subtasks()[index].id,
        });
      }
    }
  }

  /**
   * Applies the category badge SCSS class based on category name.
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
   * Formats ISO date string hyphens to slashes for UI presentation.
   *
   * @param date - Date string formatted as YYYY-MM-DD.
   * @returns Formatted date string (YYYY/MM/DD).
   */
  setTicketDueDate(date: string) {
    return date.replaceAll('-', '/');
  }

  /**
   * Sets the image path for the priority icon based on priority level.
   *
   * @param prio - Priority string level.
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
   * Deletes task and all associated subtasks from database, then closes details modal.
   */
  deleteTicket() {
    this.board.closeTicketCard(false);

    for (let index = 0; index < this.board.subtasks().length; index++) {

      if (this.board.subtasks()[index].task_id == this.openTicketID) {
        this.board.db.deleteSubtask(this.board.subtasks()[index].id);
      }
    }
    this.board.db.deleteTask(this.openTicketID);
  }

  /**
   * Toggles subtask completion checkbox UI state and updates database status.
   *
   * @param x - Target subtask item.
   */
  checkBox(x: subTask) {
    let checkBoxID = String(x.id);
    let subTaskState: boolean = true;
    let currentButton = document.getElementById(String('checkbox_' + checkBoxID)) as HTMLImageElement;

    if (currentButton.classList.contains('subtasks_btn_true')) {
      currentButton.classList.remove('subtasks_btn_true');
      currentButton.classList.add('subtasks_btn_false');
      currentButton.src = 'assets/UI/checkbox_default.png';
      subTaskState = false;
    } else {
      currentButton.classList.remove('subtasks_btn_false');
      currentButton.classList.add('subtasks_btn_true');
      currentButton.src = 'assets/UI/checkbox_selected.png';
    }
    
    this.board.db.updateSubtasks(x.id, subTaskState);
  }

  /**
   * Closes ticket details modal dialog window.
   *
   * @param X - Flag indicating if changes should be saved.
   */
  closeTC(X: boolean) {
    this.board.closeTicketCard(X);
  }
}
