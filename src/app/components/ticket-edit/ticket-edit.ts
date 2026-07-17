import { Component, inject} from '@angular/core';
import { Board } from '../../pages/board/board';


interface subTask {
  title: String;
  is_Done: Boolean;
  id: number;
}

interface newSubTask {
  task_id: number;
  title: string;
  is_done: boolean;
}

@Component({
  selector: 'app-ticket-edit',
  imports: [],
  templateUrl: './ticket-edit.html',
  styleUrl: './ticket-edit.scss',
})
export class TicketEdit {

board = inject(Board);

ddOpen: boolean = false;

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

closeDropDown() {
  let dropdownWindow = document.getElementById('dropdown_list') as HTMLDialogElement;
  dropdownWindow.style.display = 'none';
  for (let index = 0; index < this.board.ddContacts.length; index++) {
    let contact = document.getElementById(
      'dd_contact_' + String(this.board.ddContacts[index]),
    ) as HTMLDivElement;
    let checkBox = document.getElementById(
      'dd_checkbox_' + String(this.board.ddContacts[index]),
    ) as HTMLImageElement;
    contact.classList.remove('contact_selected');
    checkBox.src = 'assets/UI/checkbox_default.png';
  }
  this.board.ddContacts = [];
  this.ddOpen = false;
}

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

selectDropDownContact(contactID: number) {
  let selectedContact = document.getElementById(
    'dd_contact_' + String(contactID),
  ) as HTMLDivElement;
  let selectedCheckBox = document.getElementById(
    'dd_checkbox_' + String(contactID),
  ) as HTMLImageElement;
  if (this.board.ddContacts.includes(contactID) == false) {
    this.board.ddContacts.push(contactID);
    selectedContact.classList.add('contact_selected');
    selectedCheckBox.src = 'assets/UI/checkbox_selected_white.png';
  } else if (this.board.ddContacts.includes(contactID) == true) {
    this.board.ddContacts.indexOf(contactID) !== -1 &&
    this.board.ddContacts.splice(this.board.ddContacts.indexOf(contactID), 1);
    selectedContact.classList.remove('contact_selected');
    selectedCheckBox.src = 'assets/UI/checkbox_default.png';
  }
}

subtaskInput: boolean = false;

checkSubtaskInput() {
  let subtaskCheckButton = document.getElementById('subtask_input_check') as HTMLImageElement;
  if (this.subtaskInput == false) {
    this.subtaskInput = true;
    subtaskCheckButton.style.display = 'flex';
  }
}
unCheckSubtaskInput() {
  let subtaskCheckButton = document.getElementById('subtask_input_check') as HTMLImageElement;
  this.subtaskInput = false;
  subtaskCheckButton.style.display = 'none';
}

async createNewSubtask() {
  let subtaskInput = document.getElementById('editTaskSubtasks') as HTMLInputElement;
  let newSubtaskTitle = subtaskInput.value;
  let newSubtask: newSubTask[] = [
    {
      task_id: this.board.ticketCardID,
      title: newSubtaskTitle,
      is_done: false,
    },
  ];
  let newSubtaskID: number = 0;
  for (let index = 0; index < this.board.db.subtasks().length; index++) {
    if (this.board.db.subtasks()[index].title == newSubtaskTitle) {
      newSubtaskID = this.board.db.subtasks()[index].id;
    }
  }
  this.board.subtasksCache.push({
    title: newSubtaskTitle,
    is_Done: false,
    id: newSubtaskID,
  });
  this.board.db.addSubtasks(newSubtask);
  subtaskInput.value = '';
  this.unCheckSubtaskInput();
}

deleteSubtask(subtask: subTask) {
  let targetSubtask = document.getElementById(String(subtask.id)) as HTMLDivElement;
  targetSubtask.style.display = 'none';
  this.board.db.deleteSubtask(subtask.id);
}

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

closeTC(X:boolean){
  this.board.closeTicketCard(X);
  this.closeDropDown();
}

}
