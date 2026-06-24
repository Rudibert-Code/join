import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supabase, Task, Subtask } from '../../supabase';
import { RouterLink } from '@angular/router';

interface subTask{
  title:String,
  is_Done:String,
  id:number
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
  tasks = computed(() => this.db.tasks());
  subtasks = computed(() => this.db.subtasks());

  taskTitle: string = '';
  taskDescr: string = '';
  taskLimitDate: string = '';
  taskPriority: string = '';
  taskCategory: string = '';
  searchQuery: string = '';

  ngOnInit() {
    this.loadTasks();
  }

  async loadTasks() {
    const tasks = await this.db.getTasks();
    const subtasks = await this.db.getSubtasks();
  }

  get todoTasks() {
    return this.filterTasksByCategory('todo');
  }

  get progressTasks() {
    return this.filterTasksByCategory('progress');
  }

  get feedbackTasks() {
    return this.filterTasksByCategory('feedback');
  }

  get doneTasks() {
    return this.filterTasksByCategory('done');
  }

  private filterTasksByCategory(categoryKey: 'todo' | 'progress' | 'feedback' | 'done') {
    let filtered = this.tasks().filter((task) => this.getCategoryKey(task) === categoryKey);
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter((task) => 
        task.title?.toLowerCase().includes(query) || 
        task.description?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  getNormalizedPriority(priority: string): string {
    return priority.replace(/^\$/, '').trim().toLowerCase();
  }

  private getCategoryKey(task: Task): 'todo' | 'progress' | 'feedback' | 'done' {
    const category = task.category?.toLowerCase().trim() || '';

    if (category.includes('progress')) {
      return 'progress';
    }
    if (category.includes('feedback')) {
      return 'feedback';
    }
    if (category.includes('done')) {
      return 'done';
    }
    return 'todo';
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

    for (let index = 0; index < this.tasks().length; index++) {
      if (this.tasks()[index].id == id) {
        ticketTitle.textContent = this.tasks()[index].title;
        ticketDescription.innerHTML = this.tasks()[index].description;
        ticketDueDate.innerHTML = String(this.setTicketDueDate(this.tasks()[index].due_date));
        ticketPriority.innerHTML = this.tasks()[index].priority;
        this.setTicketPrioIcon(this.tasks()[index].priority);
        ticketCategory.innerHTML = this.tasks()[index].category;
        this.setTicketCatClass(this.tasks()[index].category);
      }
    }  

    this.getSubTasks(id);
    dialogWindow.showModal();
  }

  //subtasksCache:string[] = [];
  subtasksCache:subTask[] = [];

  async getSubTasks(id:any){
    this.subtasksCache = [];

    for (let index = 0; index < this.subtasks().length; index++) {

      if (this.subtasks()[index].task_id == id) {
        //this.subtasksCache.unshift((this.subtasks()[index].title));
        this.subtasksCache.push({
          title:this.subtasks()[index].title,
          is_Done:this.subtasks()[index].is_done,
          id:this.subtasks()[index].id
          })
      }
    }
  }

  setTicketCatClass(cat:string){
    let className:string = "";
    let targetParagraph = document.getElementById('ticket_category') as HTMLParagraphElement;
    targetParagraph.classList.remove("task-card--technical","task-card--user");

    switch (cat) {
      case 'Technical Tasks':
        className = "task-card--technical"
        break;

      default:
        className = "task-card--user"
        break;
    }
    targetParagraph.classList.add(className);
  }

  setTicketDueDate(date:string){
    return date.replaceAll('-','/');
  }

  setTicketPrioIcon(prio:string){
    let ticketPrioIcon = document.getElementById('prio-icon') as HTMLImageElement;
    let iconURL:string = ""; 

    switch (prio) {
      case 'urgent':
        iconURL = "assets/UI/icon_prio-urgent.png";
        break;

      case 'low':
        iconURL = "assets/UI/icon_prio-low.png";
        break;
    
      default:
        iconURL = "assets/UI/icon_prio-medium.png";
        break;
    }
    ticketPrioIcon.src = iconURL;
  }

  closeTicketCard(){
    let dialogWindow = document.getElementById('ticket_card') as HTMLDialogElement;
    dialogWindow.close();
  }

  checkBox(x:subTask){
    let checkBoxID = String(x.id);
    let currentButton = document.getElementById(checkBoxID) as HTMLImageElement;
    
    if (currentButton.classList.contains("subtasks_btn_true")) {
      currentButton.classList.add("subtasks_btn_false");
    }

    currentButton.classList.toggle("subtasks_btn_true");
  }
}
