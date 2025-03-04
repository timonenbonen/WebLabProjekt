import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: RouterModule) {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    console.log('User is logged in:', !!token);
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('token'); // ✅ Clear authentication token
  }
}
