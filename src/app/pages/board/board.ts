import { Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supabase, Task, Subtask, TaskContacts, Contact } from '../../supabase';
import { RouterLink } from '@angular/router';

interface subTask {
  title: String;
  is_Done: Boolean;
  id: number;
}

interface contacts {
  id: number;
  name: string;
  surname: string;
  initials: string;
  color: string;
}

interface newSubTask {
  task_id: number;
  title: string;
  is_done: boolean;
}

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  db = inject(Supabase);
  contacts = computed(() => this.db.contacts());
  tasks = computed(() => this.db.tasks());
  subtasks = computed(() => this.db.subtasks());
  task_contacts = computed(() => this.db.task_contacts());

  taskTitle: string = '';
  taskDescr: string = '';
  taskLimitDate: string = '';
  taskPriority: string = '';
  taskCategory: string = '';
  searchQuery: string = '';

  openTicketID: number = 0;
  activeDropZone: string | null = null;

  isDropTarget(zone: string): boolean {
    return this.activeDropZone === zone;
  }

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    const contact = await this.db.getContacts();
    const tasks = await this.db.getTasks();
    const subtasks = await this.db.getSubtasks();
    const task_contacts = await this.db.getTaskToContacts();
  }

  get todoTasks() {
    return this.filterTasksByCategory('to_do');
  }

  get progressTasks() {
    return this.filterTasksByCategory('in_progress');
  }

  get feedbackTasks() {
    return this.filterTasksByCategory('await_feedback');
  }

  get doneTasks() {
    return this.filterTasksByCategory('done');
  }

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

  getNormalizedPriority(priority: string): string {
    return priority.replace(/^\$/, '').trim().toLowerCase();
  }

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

  startDragging(id: number, event: DragEvent) {
    event.dataTransfer?.setData('text/plain', id.toString());
    const target = event.target as HTMLElement;
    const taskCard = target.closest('.task-card') as HTMLElement;
    if (taskCard) {
      taskCard.classList.add('dragging');
    }
  }

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

  dragOver(zone: string, event: DragEvent) {
    event.preventDefault();
    if (this.activeDropZone !== zone) {
      if (this.activeDropZone) {
        this.removeDropTargetClass(this.activeDropZone);
      }
      this.activeDropZone = zone;
    }
  }

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

  private addDropTargetClass(zone: string) {
    const container = document.getElementById(zone) as HTMLElement;
    if (container) {
      container.classList.add('drop-target');
    }
  }

  private removeDropTargetClass(zone: string) {
    const container = document.getElementById(zone) as HTMLElement;
    if (container) {
      container.classList.remove('drop-target');
    }
  }

  async moveToStatus(status: string, event: DragEvent) {
    event.preventDefault();
    const idStr = event.dataTransfer?.getData('text/plain');

    if (idStr) {
      const id = Number(idStr);
      //const id = parseInt(idStr, 10);

      await this.db.updateTaskStatus(id, status);
      this.loadTasks();
    }

    if (this.activeDropZone) {
      this.removeDropTargetClass(this.activeDropZone);
      this.activeDropZone = null;
    }
  }

  async mobileMoveToStatus(id: number, status: string) {
    await this.db.updateTaskStatus(id, status);
    this.loadTasks();
  }

  getTaskCardClass(category: string): string {
    const categoryLower = category?.toLowerCase().trim() || '';
    return categoryLower.includes('technical') ? 'task-card--technical' : 'task-card--user';
  }

  //Open Ticket Card

  openTicketCard(id: number) {
    const dialogWindow = document.getElementById('ticket_card') as HTMLDialogElement;
    const ticketTitle = document.getElementById('ticket_title') as HTMLHeadingElement;
    const ticketDescription = document.getElementById('ticket_description') as HTMLParagraphElement;
    const ticketDueDate = document.getElementById('ticket_due-date') as HTMLParagraphElement;
    const ticketPriority = document.getElementById('ticket_priority') as HTMLParagraphElement;
    const ticketCategory = document.getElementById('ticket_category') as HTMLParagraphElement;

    this.ticketCardID = id;

    for (let index = 0; index < this.tasks().length; index++) {
      if (this.tasks()[index].id == id) {
        ticketTitle.textContent = this.cutInout(this.tasks()[index].title, 'title');
        ticketDescription.innerHTML = this.cutInout(this.tasks()[index].description, 'description');
        ticketDueDate.innerHTML = String(this.setTicketDueDate(this.tasks()[index].due_date));
        ticketPriority.innerHTML = this.tasks()[index].priority;
        this.setTicketPrioIcon(this.tasks()[index].priority);
        ticketCategory.innerHTML = this.tasks()[index].category;
        this.setTicketCatClass(this.tasks()[index].category);
      }
    }
    this.openTicketID = id;
    this.getContacts(id);
    this.getSubTasks(id);
    dialogWindow.showModal();
  }

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

  openTicketEdit() {
    const dialogEdit = document.getElementById('ticket_edit') as HTMLDialogElement;
    const dialogEditTitle = document.getElementById('editTaskTitle') as HTMLInputElement;
    const dialogEditDescription = document.getElementById(
      'editTaskDescription',
    ) as HTMLInputElement;
    const dialogEditDueDate = document.getElementById('subtask_edit_dd') as HTMLInputElement;
    let dialogPrio: string = '';

    for (let index = 0; index < this.tasks().length; index++) {
      if (this.tasks()[index].id == this.ticketCardID) {
        dialogEditTitle.value = this.tasks()[index].title;
        dialogEditDescription.value = this.tasks()[index].description;
        dialogEditDueDate.value = this.tasks()[index].due_date;
        dialogPrio = this.tasks()[index].priority;
      }
    }
    this.closeTicketCard(false);
    this.editTicketPrio(dialogPrio);
    this.setContactColor(this.ticketCardID);
    dialogEdit.showModal();
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
    this.db.updateTaskPrio(this.ticketCardID, newPrio);
  }

  updateTicketEdit() {
    const ticketTitle = document.getElementById('editTaskTitle') as HTMLInputElement;
    const ticketDescription = document.getElementById('editTaskDescription') as HTMLInputElement;
    const ticketDueDate = document.getElementById('subtask_edit_dd') as HTMLInputElement;

    this.newDialogEditTitle = ticketTitle.value;
    this.newDialogDescription = ticketDescription.value;
    this.newDialogDueDate = ticketDueDate.value;

    this.db.updateTaskTitle(this.ticketCardID, this.newDialogEditTitle);
    this.db.updateTaskDescription(this.ticketCardID, this.newDialogDescription);
    this.db.updateTaskDueDate(this.ticketCardID, this.newDialogDueDate);
    this.closeTicketCard(true);
  }

  setContactColor(taskId: number) {
    for (let index = 0; index < this.db.task_contacts().length; index++) {
      if (this.db.task_contacts()[index].task_id == taskId) {
        let currentContactID = this.db.task_contacts()[index].contact_id;

        for (let index = 0; index < this.db.contacts().length; index++) {
          if (this.db.contacts()[index].id == currentContactID) {
            let currentContactClass = 'contacts_icon_' + this.db.contacts()[index].color.slice(1);
            let currentContact = document.getElementById(
              String(currentContactID),
            ) as HTMLDivElement;
            currentContact.classList.add(currentContactClass);
          }
        }
      }
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
        task_id: this.ticketCardID,
        title: newSubtaskTitle,
        is_done: false,
      },
    ];
    let newSubtaskID: number = 0;
    for (let index = 0; index < this.db.subtasks().length; index++) {
      if (this.db.subtasks()[index].title == newSubtaskTitle) {
        newSubtaskID = this.db.subtasks()[index].id;
      }
    }
    this.subtasksCache.push({
      title: newSubtaskTitle,
      is_Done: false,
      id: newSubtaskID,
    });
    this.db.addSubtasks(newSubtask);
    subtaskInput.value = '';
    this.unCheckSubtaskInput();
  }

  deleteSubtask(subtask: subTask) {
    let targetSubtask = document.getElementById(String(subtask.id)) as HTMLDivElement;
    targetSubtask.style.display = 'none';
    this.db.deleteSubtask(subtask.id);
  }

  contactsCache: contacts[] = [];

  async getContacts(id: number) {
    this.contactsCache = [];

    const linkedContacts = this.contacts();

    for (const relation of this.task_contacts()) {
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

  async getSubTasks(id: any) {
    this.subtasksCache = [];

    for (let index = 0; index < this.subtasks().length; index++) {
      if (this.subtasks()[index].task_id == id) {
        //this.subtasksCache.unshift((this.subtasks()[index].title));
        this.subtasksCache.push({
          title: this.subtasks()[index].title,
          is_Done: this.subtasks()[index].is_done,
          id: this.subtasks()[index].id,
        });
      }
    }
  }

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

  setTicketDueDate(date: string) {
    return date.replaceAll('-', '/');
  }

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

  closeTicketCard(changes: boolean) {
    let dialogWindow = document.getElementById('ticket_card') as HTMLDialogElement;
    let dialogEdit = document.getElementById('ticket_edit') as HTMLDialogElement;
    dialogWindow.close();
    dialogEdit.close();
    if (changes == true) {
      this.assignContactsToTask(this.openTicketID, this.ddContacts);
    }
    this.closeDropDown();
  }

  deleteTicket() {
    this.closeTicketCard(false);
    for (let index = 0; index < this.subtasks().length; index++) {
      if (this.subtasks()[index].task_id == this.openTicketID) {
        this.db.deleteSubtask(this.subtasks()[index].id);
      }
    }
    this.db.deleteTask(this.openTicketID);
  }

  checkBox(x: subTask) {
    let checkBoxID = String(x.id);
    let subTaskState: boolean = true;
    let currentButton = document.getElementById(
      String('checkbox_' + checkBoxID),
    ) as HTMLImageElement;

    if (currentButton.classList.contains('subtasks_btn_true')) {
      currentButton.classList.add('subtasks_btn_false');
      subTaskState = false;
    }

    currentButton.classList.toggle('subtasks_btn_true');

    this.db.updateSubtasks(x.id, subTaskState);
  }

  ddContacts: number[] = [];
  ddOpen: boolean = false;

  openDropDown() {
    let dropdownWindow = document.getElementById('dropdown_list') as HTMLDialogElement;
    if (this.ddOpen == false) {
      this.ddOpen = true;
      dropdownWindow.style.display = 'flex';
      for (let index = 0; index < this.db.task_contacts().length; index++) {
        if (this.db.task_contacts()[index].task_id == this.openTicketID) {
          let currentContactID = Number(this.db.task_contacts()[index].contact_id);
          this.selectDropDownContact(currentContactID);
        }
      }
    }
  }

  closeDropDown() {
    let dropdownWindow = document.getElementById('dropdown_list') as HTMLDialogElement;
    dropdownWindow.style.display = 'none';
    for (let index = 0; index < this.ddContacts.length; index++) {
      let contact = document.getElementById(
        'dd_contact_' + String(this.ddContacts[index]),
      ) as HTMLDivElement;
      let checkBox = document.getElementById(
        'dd_checkbox_' + String(this.ddContacts[index]),
      ) as HTMLImageElement;
      contact.classList.remove('contact_selected');
      checkBox.src = 'assets/UI/checkbox_default.png';
    }
    this.ddContacts = [];
    this.ddOpen = false;
  }

  selectDropDownContact(contactID: number) {
    let selectedContact = document.getElementById(
      'dd_contact_' + String(contactID),
    ) as HTMLDivElement;
    let selectedCheckBox = document.getElementById(
      'dd_checkbox_' + String(contactID),
    ) as HTMLImageElement;

    if (this.ddContacts.includes(contactID) == false) {
      this.ddContacts.push(contactID);
      selectedContact.classList.add('contact_selected');
      selectedCheckBox.src = 'assets/UI/checkbox_selected_white.png';
    } else if (this.ddContacts.includes(contactID) == true) {
      this.ddContacts.indexOf(contactID) !== -1 &&
        this.ddContacts.splice(this.ddContacts.indexOf(contactID), 1);
      selectedContact.classList.remove('contact_selected');
      selectedCheckBox.src = 'assets/UI/checkbox_default.png';
    }
  }

  async assignContactsToTask(taskId: number, contactIds: number[]) {
    this.filterContacts(taskId);
    const taskContacts = this.buildTaskContacts(taskId, contactIds);
    console.table(taskContacts);
    await this.db.addTaskContacts(taskContacts);
  }

  filterContacts(taskID: number) {
    let entryCounter: number = 0;
    for (let index = 0; index < this.db.task_contacts().length; index++) {
      if (this.db.task_contacts()[index].task_id == taskID) {
        entryCounter++;
      }
    }
    this.ddContacts.splice(0, entryCounter);
  }

  buildTaskContacts(taskId: number, contactIds: number[]) {
    return contactIds.map((contactId) => ({
      task_id: taskId,
      contact_id: contactId,
    }));
  }

  getSubtaskAmount(taskId: number): Subtask[] {
    return this.subtasks().filter((subtask) => subtask.task_id === taskId);
  }

  getCompletedSubtasksAmount(taskId: number): number {
    const taskSubtasks = this.getSubtaskAmount(taskId);
    return taskSubtasks.filter((subtask) => subtask.is_done).length;
  }

  getProgress(taskId: number): number {
    const taskSubtasks = this.getSubtaskAmount(taskId);
    const total = taskSubtasks.length;

    if (total === 0) return 0;

    const completed = taskSubtasks.filter((subtask) => subtask.is_done).length;
    return (completed / total) * 100;
  }

  getContactsForTaskcard(taskId: number) {
    const allContacts = this.contacts();
    const relationContacts = this.task_contacts();
    const matchedContacts = [];
    for (const relation of relationContacts) {
      if (relation.task_id === taskId) {
        const contact = allContacts.find((contact) => contact.id === relation.contact_id);
        if (contact) {
          matchedContacts.push({
            initials: `${contact.first_name.charAt(0).toUpperCase()}${contact.last_name.charAt(0).toUpperCase()}`,
            color: contact.color.startsWith('#') ? contact.color : `#${contact.color}`,
          });
        }
      }
    }
    return matchedContacts;
  }
}
