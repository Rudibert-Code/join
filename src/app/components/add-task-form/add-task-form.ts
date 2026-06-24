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

  constructor() {
    this.supabase.getContacts();
  }
  // contacts = [
  //   { id: 1, first_name: 'Eva', last_name: 'Fischer', color: '#ff7a00' },
  //   { id: 2, first_name: 'Emmanuel', last_name: 'Mauer', color: '#00bee8' },
  //   { id: 3, first_name: 'Marcel', last_name: 'Bauer', color: '#6e52ff' },
  // ];

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

    // subtasks: new FormArray<FormControl<string>>([]),
  });

  setPriority(priority: 'urgent' | 'medium' | 'low') {
    this.taskForm.controls.priority.setValue(priority);
  }

  isAssignedDropdownOpen = false;

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
}
