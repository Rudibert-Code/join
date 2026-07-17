import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supabase, Task, Subtask} from '../../supabase';
import { RouterLink } from '@angular/router';

import { TicketDetails } from '../../components/ticket-details/ticket-details';
import { TicketEdit } from '../../components/ticket-edit/ticket-edit';

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
  imports: [CommonModule, RouterLink, FormsModule, TicketDetails],
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
        color: String(matchingContact.color),
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
    setTimeout(()=>{
    this.setCheckBoxState(id);
    },0)
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
  }

  setCheckBoxState(taskID:number){
  for (let index = 0; index < this.db.subtasks().length; index++) {
    let targetCheckBox = document.getElementById("checkbox_" + this.db.subtasks()[index].id) as HTMLImageElement;
    if (this.db.subtasks()[index].task_id == taskID && this.db.subtasks()[index].is_done == true) {
      targetCheckBox.src ="assets/UI/checkbox_selected.png";
    } else if (this.db.subtasks()[index].task_id == taskID && this.db.subtasks()[index].is_done == false) {
      targetCheckBox.src ="assets/UI/checkbox_default.png";
    }
  }
}

 ddContacts: number[] = [];

  async assignContactsToTask(taskId: number, contactIds: number[]) {
    this.filterContacts(taskId);
    const taskContacts = this.buildTaskContacts(taskId, contactIds);
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
