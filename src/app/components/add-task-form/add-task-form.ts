import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Contact, Supabase } from '../../supabase';
import { ActivatedRoute, Router } from '@angular/router';

export interface TaskFormRawValue {
  title: string;
  description: string | null;
  due_date: string;
  priority: 'urgent' | 'medium' | 'low';
  category: 'Technical Tasks' | 'User Story' | '';
  assignedContactIds: number[];
  subtasks: string[];
}

/**
 * Component providing a reactive form to create new tasks, manage subtasks,
 * assign contacts, and persist data via Supabase.
 */
@Component({
  selector: 'app-add-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task-form.html',
  styleUrl: './add-task-form.scss',
})
export class AddTaskForm {
  /** Supabase service instance for contact loading and task creation. */
  supabase = inject(Supabase);

  /** Signal reference to loaded contacts list. */
  contacts = this.supabase.contacts;

  /** Local DOM element reference used for click-outside detection. */
  private elementRef = inject(ElementRef<HTMLElement>);

  /** Current ISO date string used for minimum due date validation (DD-MM-YYYY). */
  today = new Date().toISOString().split('T')[0];

  /** Upper limit date string for due date validation. */
  maxDueDate = '2099-12-31';

  /** State flag toggling visibility of the contacts selection dropdown. */
  isAssignedDropdownOpen = false;

  /** State flag indicating whether the subtask input field is active/focused. */
  isSubtaskInputActive = false;

  /** Tracks the index of the subtask currently being edited inline, or null if none. */
  editingSubtaskIndex: number | null = null;

  /** State flag controlling display of form validation error messages. */
  showValidationErrors = false;

  /** Target kanban board status for the new task. */
  taskStatus = 'to_do';

  /** Form control for the temporary inline subtask input. */
  subtaskInput = new FormControl('', {
    nonNullable: true,
  });

  /** Main reactive form structure controlling task fields and validations. */
  taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    description: new FormControl(''),
    due_date: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, this.dueDateValidator.bind(this)],
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

  /**
   * Reads optional status query parameter from active route snapshot.
   */
  ngOnInit() {
    const status = this.route.snapshot.queryParamMap.get('status');

    if (status) {
      this.taskStatus = status;
    }
  }

  /**
   * Custom form control validator ensuring due date falls between current date and max allowed limit.
   *
   * @param control - Form control containing due date string value.
   * @returns ValidationErrors object if invalid, otherwise null.
   */
  dueDateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value < this.today || value > this.maxDueDate) {
      return { invalidDueDate: true };
    }

    return null;
  }

  /**
   * Updates task priority selection in reactive form state.
   *
   * @param priority - Selected priority level.
   */
  setPriority(priority: 'urgent' | 'medium' | 'low') {
    this.taskForm.controls.priority.setValue(priority);
  }

  /**
   * Toggles visibility state of assigned contacts dropdown list.
   */
  toggleAssignedDropdown() {
    this.isAssignedDropdownOpen = !this.isAssignedDropdownOpen;
  }

  /**
   * Document click listener closing assigned contacts dropdown when user clicks outside.
   *
   * @param event - DOM mouse click event.
   */
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

  /**
   * Toggles assigned state for a specific contact ID.
   *
   * @param contactId - Target contact ID to toggle.
   */
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

  /**
   * Checks whether a contact ID is currently assigned to the task form.
   *
   * @param contactId - Target contact ID.
   * @returns True if contact ID is selected.
   */
  isContactSelected(contactId: number) {
    return this.taskForm.controls.assignedContactIds.value.includes(contactId);
  }

  /**
   * Filters all available contacts to return only currently selected contact objects.
   *
   * @returns Array of assigned Contact records.
   */
  selectedContacts(): Contact[] {
    const selectedIds = this.taskForm.controls.assignedContactIds.value;
    return this.contacts().filter((contact) => selectedIds.includes(contact.id));
  }

  /** Getter for subtasks FormArray control. */
  get subtasks() {
    return this.taskForm.controls.subtasks;
  }

  /**
   * Appends a non-empty subtask title to the subtasks FormArray and resets input.
   */
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

  /** Activates action buttons for subtask creation input. */
  showSubtaskInputActions() {
    this.isSubtaskInputActive = true;
  }

  /** Clears subtask input control and deactivates input actions. */
  cancelNewSubtask() {
    this.subtaskInput.setValue('');
    this.isSubtaskInputActive = false;
  }

  /**
   * Sets subtask at index into inline editing mode.
   *
   * @param index - Index of subtask control in FormArray.
   */
  startEditSubtask(index: number) {
    this.editingSubtaskIndex = index;
  }

  /**
   * Confirms inline subtask edits or removes it if title is cleared.
   *
   * @param index - Index of subtask control in FormArray.
   */
  confirmSubtask(index: number) {
    const title = this.subtasks.at(index).value.trim();

    if (!title) {
      this.deleteSubtask(index);
      return;
    }

    this.subtasks.at(index).setValue(title);
    this.editingSubtaskIndex = null;
  }

  /**
   * Removes subtask item from FormArray at specified index.
   *
   * @param index - Index of subtask control in FormArray.
   */
  deleteSubtask(index: number) {
    this.subtasks.removeAt(index);

    if (this.editingSubtaskIndex === index) {
      this.editingSubtaskIndex = null;
    }
  }

  /** Resets task form, subtask list, and validation flags to default state. */
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
    this.showValidationErrors = false;
  }

  /**
   * Evaluates form validity state and marks controls touched if invalid.
   *
   * @returns True if form is invalid, otherwise false.
   */
  private isTaskFormInvalid() {
    this.showValidationErrors = true;

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return true;
    }
    return false;
  }

/**
   * Prepares payload object for primary task record insertion.
   * 
   * @param formValue - Raw value of task form matching TaskFormRawValue.
   * @returns Formatted task data object.
   */
  private buildNewTask(formValue: TaskFormRawValue) {
    return {
      title: formValue.title.trim(),
      description: formValue.description?.trim() || null,
      due_date: formValue.due_date,
      priority: formValue.priority,
      category: formValue.category,
      status: this.taskStatus,
    };
  }

  /**
   * Inserts primary task record into Supabase database.
   *
   * @param formValue - Raw value of task form matching TaskFormRawValue.
   * @returns Created task database object or error state.
   */
  private async createMainTask(formValue: TaskFormRawValue) {
    const newTask = this.buildNewTask(formValue);
    return await this.supabase.addTask(newTask);
  }

  /**
   * Builds array of subtask insertion objects mapped to parent task ID.
   * 
   * @param taskId - Parent task database ID.
   * @param subtaskTitles - List of subtask titles.
   * @returns Array of formatted subtask payload objects.
   */
  private buildNewSubtasks(taskId: number, subtaskTitles: string[]) {
    return subtaskTitles
      .map((title) => ({
        task_id: taskId,
        title: title.trim(),
        is_done: false,
      }))
      .filter((subtask) => subtask.title);
  }

  /**
   * Persists subtasks associated with created task to Supabase.
   * 
   * @param taskId - Parent task database ID.
   * @param subtaskTitles - List of subtask titles.
   */
  private async createSubtasks(taskId: number, subtaskTitles: string[]) {
    const newSubtasks = this.buildNewSubtasks(taskId, subtaskTitles);
    await this.supabase.addSubtasks(newSubtasks);
  }

  /**
   * Builds relational mapping objects linking contact IDs to created task ID.
   * 
   * @param taskId - Target task database ID.
   * @param contactIds - List of assigned contact IDs.
   * @returns Array of task-contact join records.
   */
  private buildTaskContacts(taskId: number, contactIds: number[]) {
    return contactIds.map((contactId) => ({
      task_id: taskId,
      contact_id: contactId,
    }));
  }

  /**
   * Persists task contact assignments in database.
   * 
   * @param taskId - Target task database ID.
   * @param contactIds - List of assigned contact IDs.
   */
  private async assignContactsToTask(taskId: number, contactIds: number[]) {
    const taskContacts = this.buildTaskContacts(taskId, contactIds);
    await this.supabase.addTaskContacts(taskContacts);
  }

  /**
   * Validates form, creates task record along with subtasks and contact assignments, then redirects to board view.
   */
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
