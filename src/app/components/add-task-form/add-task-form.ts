import { Component } from '@angular/core';
import { FormArray, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './add-task-form.html',
  styleUrl: './add-task-form.scss',
})
export class AddTaskForm {
  // contacts = [
  //   { id: 1, first_name: 'Anna', last_name: 'Müller' },
  //   { id: 2, first_name: 'Max', last_name: 'Schneider' },
  //   { id: 3, first_name: 'Lisa', last_name: 'Weber' },
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

    // assignedContactIds: new FormControl<number[]>([], {
    //   nonNullable: true,
    // }),

    // subtasks: new FormArray<FormControl<string>>([]),
  });

  setPriority(priority: 'urgent' | 'medium' | 'low') {
    this.taskForm.controls.priority.setValue(priority);
  }
}
