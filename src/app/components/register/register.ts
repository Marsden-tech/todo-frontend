import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
  this.authService.register({ username: this.username, password: this.password, email: this.email }).subscribe({
    next: (response) => {
      if (response.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/todos']);
      }
    },
    error: () => this.error = 'Registration failed. Please try again.'
  });
}
}