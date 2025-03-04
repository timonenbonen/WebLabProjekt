import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Required for `*ngIf`
import { FormsModule } from '@angular/forms';  // ✅ Required for `[(ngModel)]`
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true, // ✅ Since Angular Standalone API
  imports: [CommonModule, FormsModule], // ✅ Import necessary modules
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  displayname = '';
  username = '';
  password = '';
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    console.log('Registering with:', this.displayname, this.username, this.password); // ✅ Debugging

    if (!this.displayname || !this.username || !this.password) {
      this.errorMessage = 'All fields are required!';
      return;
    }
    this.authService.register(this.displayname, this.username, this.password).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.errorMessage = 'Registration failed';
      },
    });
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
