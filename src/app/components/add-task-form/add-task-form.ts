import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact, Supabase } from '../../supabase';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task-form.html',
  styleUrl: './add-task-form.scss',
})
export class AddTaskForm {
  supabase = inject(Supabase);
  contacts = this.supabase.contacts;
  private elementRef = inject(ElementRef<HTMLElement>);

  today = new Date().toISOString().split('T')[0];
  isAssignedDropdownOpen = false;
  isSubtaskInputActive = false;
  editingSubtaskIndex: number | null = null;
  taskStatus = 'to_do';

  subtaskInput = new FormControl('', {
    nonNullable: true,
  });

  taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl(''),
    due_date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<'urgent' | 'medium' | 'low'>('medium', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    category: new FormControl<'Technical Tasks' | 'User Story' | ''>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    assignedContactIds: new FormControl<number[]>([], {
      nonNullable: true,
    }),

    subtasks: new FormArray<FormControl<string>>([]),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.supabase.getContacts();
  }

  ngOnInit() {
    const status = this.route.snapshot.queryParamMap.get('status');

    if (status) {
      this.taskStatus = status;
    }
  }

  setPriority(priority: 'urgent' | 'medium' | 'low') {
    this.taskForm.controls.priority.setValue(priority);
  }

  toggleAssignedDropdown() {
    this.isAssignedDropdownOpen = !this.isAssignedDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeAssignedDropdownOnOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const assignedDropdown = this.elementRef.nativeElement.querySelector('.assigned-dropdown');

    if (
      this.isAssignedDropdownOpen &&
      assignedDropdown &&
      !assignedDropdown.contains(clickedElement)
    ) {
      this.isAssignedDropdownOpen = false;
    }
  }

  toggleContact(contactId: number) {
    const currentIds = this.taskForm.controls.assignedContactIds.value;

    if (currentIds.includes(contactId)) {
      this.taskForm.controls.assignedContactIds.setValue(
        currentIds.filter((id) => id !== contactId),
      );
    } else {
      this.taskForm.controls.assignedContactIds.setValue([...currentIds, contactId]);
    }
  }

  isContactSelected(contactId: number) {
    return this.taskForm.controls.assignedContactIds.value.includes(contactId);
  }

  selectedContacts(): Contact[] {
    const selectedIds = this.taskForm.controls.assignedContactIds.value;

    return this.contacts().filter((contact) => selectedIds.includes(contact.id));
  }

  get subtasks() {
    return this.taskForm.controls.subtasks;
  }

  addSubtask() {
    const title = this.subtaskInput.value.trim();

    if (!title) {
      this.cancelNewSubtask();
      return;
    }

    this.subtasks.push(
      new FormControl(title, {
        nonNullable: true,
      }),
    );

    this.subtaskInput.setValue('');
    this.isSubtaskInputActive = false;
  }

  showSubtaskInputActions() {
    this.isSubtaskInputActive = true;
  }

  cancelNewSubtask() {
    this.subtaskInput.setValue('');
    this.isSubtaskInputActive = false;
  }

  startEditSubtask(index: number) {
    this.editingSubtaskIndex = index;
  }

  confirmSubtask(index: number) {
    const title = this.subtasks.at(index).value.trim();

    if (!title) {
      this.deleteSubtask(index);
      return;
    }

    this.subtasks.at(index).setValue(title);
    this.editingSubtaskIndex = null;
  }

  deleteSubtask(index: number) {
    this.subtasks.removeAt(index);

    if (this.editingSubtaskIndex === index) {
      this.editingSubtaskIndex = null;
    }
  }

  clearTaskForm() {
    this.taskForm.reset({
      title: '',
      description: '',
      due_date: '',
      priority: 'medium',
      category: '',
      assignedContactIds: [],
    });
    this.subtasks.clear();
    this.cancelNewSubtask();
    this.editingSubtaskIndex = null;
  }

  private isTaskFormInvalid() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return true;
    }
    return false;
  }

  private buildNewTask(formValue: any) {
    return {
      title: formValue.title.trim(),
      description: formValue.description?.trim() || null,
      due_date: formValue.due_date,
      priority: formValue.priority,
      category: formValue.category,
      status: this.taskStatus,
    };
  }

  private async createMainTask(formValue: any) {
    const newTask = this.buildNewTask(formValue);

    return await this.supabase.addTask(newTask);
  }

  private buildNewSubtasks(taskId: number, subtaskTitles: string[]) {
    return subtaskTitles
      .map((title) => ({
        task_id: taskId,
        title: title.trim(),
        is_done: false,
      }))
      .filter((subtask) => subtask.title);
  }

  private async createSubtasks(taskId: number, subtaskTitles: string[]) {
    const newSubtasks = this.buildNewSubtasks(taskId, subtaskTitles);

    await this.supabase.addSubtasks(newSubtasks);
  }

  private buildTaskContacts(taskId: number, contactIds: number[]) {
    return contactIds.map((contactId) => ({
      task_id: taskId,
      contact_id: contactId,
    }));
  }

  private async assignContactsToTask(taskId: number, contactIds: number[]) {
    const taskContacts = this.buildTaskContacts(taskId, contactIds);

    await this.supabase.addTaskContacts(taskContacts);
  }

  async createTask() {
    if (this.isTaskFormInvalid()) {
      return;
    }

    const formValue = this.taskForm.getRawValue();
    const createdTask = await this.createMainTask(formValue);

    if (!createdTask) {
      return;
    }

    await this.createSubtasks(createdTask.id, formValue.subtasks);
    await this.assignContactsToTask(createdTask.id, formValue.assignedContactIds);

    this.clearTaskForm();
    await this.router.navigate(['/board']);
  }
}
