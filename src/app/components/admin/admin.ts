import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  todos: Todo[] = [];
  activeTab = 'users';
  isLoadingUsers = false;
  isLoadingTodos = false;
  error = '';
  private apiUrl = 'https://todo-api-k4wz.onrender.com/api/admin';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTodos();
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe({
      next: (users) => {
        this.users = users;
        this.isLoadingUsers = false;
      },
      error: () => {
        this.error = 'Failed to load users.';
        this.isLoadingUsers = false;
      }
    });
  }

  loadTodos(): void {
    this.isLoadingTodos = true;
    this.http.get<Todo[]>(`${this.apiUrl}/todos`).subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoadingTodos = false;
      },
      error: () => {
        this.error = 'Failed to load todos.';
        this.isLoadingTodos = false;
      }
    });
  }

  deleteUser(id: number): void {
    this.http.delete(`${this.apiUrl}/users/${id}`).subscribe({
      next: () => this.users = this.users.filter(u => u.id !== id),
      error: () => this.error = 'Failed to delete user.'
    });
  }

  deleteTodo(id: number): void {
    this.http.delete(`${this.apiUrl}/todos/${id}`).subscribe({
      next: () => this.todos = this.todos.filter(t => t.id !== id),
      error: () => this.error = 'Failed to delete todo.'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}