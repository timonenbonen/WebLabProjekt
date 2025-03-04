import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Required for `*ngIf`
import { FormsModule } from '@angular/forms';  // ✅ Required for `[(ngModel)]`
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Since Angular Standalone API
  imports: [CommonModule, FormsModule], // ✅ Import necessary modules
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid credentials';
      },
    });
  }
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
