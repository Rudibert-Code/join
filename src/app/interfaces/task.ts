export interface Task {
  id?: number;
  title: string;
  description: string;
  due_date: string;
  priority: 'urgent' | 'medium' | 'low';
  category: 'Technical Tasks' | 'User Story';
  assignedContactIds: number[];
  subtasks: string[];
}
