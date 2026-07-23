import { Component, inject} from '@angular/core';
import { Board } from '../../pages/board/board';
import { ContactService } from '../../core/services/contact.service';

/**
 * Represents a subtask item for display in the ticket edit dialog.
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
 * Payload structure for creating a new subtask record.
 */
interface newSubTask {
  /** Parent task identifier. */
  task_id: number;
  /** Title or content of the subtask. */
  title: string;
  /** Initial completion state. */
  is_done: boolean;
}

/**
 * Handles editing existing task details, including title, description, due date, priority, contacts, and subtasks.
 */
@Component({
  selector: 'app-ticket-edit',
  imports: [],
  templateUrl: './ticket-edit.html',
  styleUrl: './ticket-edit.scss',
})

export class TicketEdit {

/** Reference to parent Board component instance. */
board = inject(Board);

cs = inject(ContactService);

/** Tracks toggle state of contact selection dropdown. */
ddOpen: boolean = false;

/**
   * Opens contact dropdown menu and pre-selects contacts currently assigned to task.
   */
openDropDown() {
  let dropdownWindow = document.getElementById('dropdown_list') as HTMLDialogElement;

  if (this.ddOpen == false) {
    this.ddOpen = true;
    dropdownWindow.style.display = 'flex';

    for (let index = 0; index < this.board.db.task_contacts().length; index++) {
      if (this.board.db.task_contacts()[index].task_id == this.board.openTicketID) {
        let currentContactID = Number(this.board.db.task_contacts()[index].contact_id);
        this.selectDropDownContact(currentContactID);
      }
    }
  }
}

/**
   * Closes contact selection dropdown menu and resets selection states.
   */
closeDropDown() {
  let dropdownWindow = document.getElementById('dropdown_list') as HTMLDialogElement;
  dropdownWindow.style.display = 'none';

  for (let index = 0; index < this.cs.ddContacts.length; index++) {
    let contact = document.getElementById('dd_contact_' + String(this.cs.ddContacts[index]),) as HTMLDivElement;
    let checkBox = document.getElementById('dd_checkbox_' + String(this.cs.ddContacts[index]),) as HTMLImageElement;
    contact.classList.remove('contact_selected');
    checkBox.src = 'assets/UI/checkbox_default.png';
  }

  this.cs.ddContacts = [];
  this.ddOpen = false;
}

/**
   * Updates visual priority button highlights and saves updated priority in database.
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
  this.board.db.updateTaskPrio(this.board.ticketCardID, newPrio);
}

/**
   * Toggles selection state of a contact inside dropdown list.
   * 
   * @param contactID - Target contact ID.
   */
selectDropDownContact(contactID: number) {
  let selectedContact = document.getElementById('dd_contact_' + String(contactID),) as HTMLDivElement;
  let selectedCheckBox = document.getElementById('dd_checkbox_' + String(contactID),) as HTMLImageElement;

  if (this.cs.ddContacts.includes(contactID) == false) {
    this.cs.ddContacts.push(contactID);
    selectedContact.classList.add('contact_selected');
    selectedCheckBox.src = 'assets/UI/checkbox_selected_white.png';
  } else if (this.cs.ddContacts.includes(contactID) == true) {
    this.cs.ddContacts.indexOf(contactID) !== -1 &&
    this.cs.ddContacts.splice(this.cs.ddContacts.indexOf(contactID), 1);
    selectedContact.classList.remove('contact_selected');
    selectedCheckBox.src = 'assets/UI/checkbox_default.png';
  }
}

subtaskInput: boolean = false;

/**
   * Displays action confirmation buttons for subtask input field.
   */
checkSubtaskInput() {
  let subtaskCheckButton = document.getElementById('subtask_input_check') as HTMLImageElement;

  if (this.subtaskInput == false) {
    this.subtaskInput = true;
    subtaskCheckButton.style.display = 'flex';
  }
}

/**
   * Hides action confirmation buttons for subtask input field.
   */
unCheckSubtaskInput() {
  let subtaskCheckButton = document.getElementById('subtask_input_check') as HTMLImageElement;
  this.subtaskInput = false;
  subtaskCheckButton.style.display = 'none';
}

/**
   * Builds the payload for a new subtask entry.
   *
   * @param title - Subtask text entered by the user.
   * @returns New subtask payload object.
   */
private buildNewSubtask(title: string): newSubTask[] {
  return [
    {
      task_id: this.board.ticketCardID,
      title,
      is_done: false,
    },
  ];
}

/**
   * Resolves the existing database ID for a subtask title if one already exists.
   *
   * @param title - Subtask text entered by the user.
   * @returns Database ID for matching subtask or 0 when none exists.
   */
private getExistingSubtaskId(title: string): number {
  let existingSubtaskId = 0;

  for (let index = 0; index < this.board.db.subtasks().length; index++) {
    if (this.board.db.subtasks()[index].title == title) {
      existingSubtaskId = this.board.db.subtasks()[index].id;
    }
  }

  return existingSubtaskId;
}

/**
   * Creates a new subtask, posts payload to database, and updates cache.
   */
async createNewSubtask() {
  const subtaskInput = document.getElementById('editTaskSubtasks') as HTMLInputElement;
  const newSubtaskTitle = subtaskInput.value;
  const newSubtask = this.buildNewSubtask(newSubtaskTitle);
  const newSubtaskID = this.getExistingSubtaskId(newSubtaskTitle);

  this.pushToSubtasksCache(newSubtaskTitle, newSubtaskID);
  this.board.db.addSubtasks(newSubtask);
  subtaskInput.value = '';
  this.unCheckSubtaskInput();
}

pushToSubtasksCache(newSubtaskTitle:string, newSubtaskID:number){
  this.board.subtasksCache.push({
    title: newSubtaskTitle,
    is_Done: false,
    id: newSubtaskID,
  });
}

/**
   * Hides subtask UI element and deletes subtask entry from database.
   * 
   * @param subtask - Target subtask object to remove.
   */
deleteSubtask(subtask: subTask) {
  let targetSubtask = document.getElementById(String(subtask.id)) as HTMLDivElement;
  targetSubtask.style.display = 'none';
  this.board.db.deleteSubtask(subtask.id);
}

/**
   * Persists modified title, description, and due date values to database and closes dialog.
   */
updateTicketEdit() {
  const ticketTitle = document.getElementById('editTaskTitle') as HTMLInputElement;
  const ticketDescription = document.getElementById('editTaskDescription') as HTMLInputElement;
  const ticketDueDate = document.getElementById('subtask_edit_dd') as HTMLInputElement;
  this.board.newDialogEditTitle = ticketTitle.value;
  this.board.newDialogDescription = ticketDescription.value;
  this.board.newDialogDueDate = ticketDueDate.value;
  this.board.db.updateTaskTitle(this.board.ticketCardID, this.board.newDialogEditTitle);
  this.board.db.updateTaskDescription(this.board.ticketCardID, this.board.newDialogDescription);
  this.board.db.updateTaskDueDate(this.board.ticketCardID, this.board.newDialogDueDate);
  this.board.closeTicketCard(true);
}

/**
   * Closes ticket dialog and resets dropdown selection view.
   * 
   * @param X - Flag indicating if changes should be saved on modal close.
   */
closeTC(X:boolean){
  this.board.closeTicketCard(X);
  this.closeDropDown();
}

}
