import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact, Supabase } from '../../supabase';

@Component({
  selector: 'app-add-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task-form.html',
  styleUrl: './add-task-form.scss',
})
export class AddTaskForm {
  supabase = inject(Supabase);
  contacts = this.supabase.contacts;
  today = new Date().toISOString().split('T')[0];
  isAssignedDropdownOpen = false;
  isSubtaskInputActive = false;
  editingSubtaskIndex: number | null = null;

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

  constructor() {
    this.supabase.getContacts();
  }

  setPriority(priority: 'urgent' | 'medium' | 'low') {
    this.taskForm.controls.priority.setValue(priority);
  }

  toggleAssignedDropdown() {
    this.isAssignedDropdownOpen = !this.isAssignedDropdownOpen;
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
}
