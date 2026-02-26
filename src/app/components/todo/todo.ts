import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { TodoService } from '../../services/todo';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.css'
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle = '';
  editingTodo: Todo | null = null;
  editTitle = '';
  isLoading = false;
  error = '';

  constructor(private todoService: TodoService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.todoService.getAll().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load todos. Please try again.';
        this.isLoading = false;
      }
    });
  }

  createTodo(): void {
    if (!this.newTodoTitle.trim()) return;
    this.todoService.create({ title: this.newTodoTitle }).subscribe({
      next: (todo) => {
        this.todos.push(todo);
        this.newTodoTitle = '';
      },
      error: () => this.error = 'Failed to create todo.'
    });
  }

  startEdit(todo: Todo): void {
    this.editingTodo = todo;
    this.editTitle = todo.title;
  }

  saveEdit(): void {
    if (!this.editingTodo) return;
    this.todoService.update(this.editingTodo.id, { title: this.editTitle }).subscribe({
      next: (updated) => {
        const index = this.todos.findIndex(t => t.id === updated.id);
        this.todos[index] = updated;
        this.editingTodo = null;
      },
      error: () => this.error = 'Failed to update todo.'
    });
  }

  completeTodo(todo: Todo): void {
    this.todoService.complete(todo.id).subscribe({
      next: (updated) => {
        const index = this.todos.findIndex(t => t.id === updated.id);
        this.todos[index] = updated;
      },
      error: () => this.error = 'Failed to complete todo.'
    });
  }

  deleteTodo(id: number): void {
    this.todoService.delete(id).subscribe({
      next: () => this.todos = this.todos.filter(t => t.id !== id),
      error: () => this.error = 'Failed to delete todo.'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}