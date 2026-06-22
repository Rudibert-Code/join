import { Component } from '@angular/core';
import { AddTaskForm } from '../../components/add-task-form/add-task-form';

@Component({
  selector: 'app-add-task',
  imports: [AddTaskForm],
  templateUrl: './add-task.html',
  styleUrl: './add-task.scss',
})
export class AddTask {}
