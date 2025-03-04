import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { RouterModule } from '@angular/router';

interface Guestbook {
  id: number;
  name: string;
  designId: number;
  shareLink: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ Add FormsModule here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  displayName: string = '';
  guestbooks: Guestbook[] = [];
  newGuestbookName: string = '';
  selectedDesignId: number = 1; // ✅ Default design ID

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.extractUserDetailsFromToken();
    this.fetchGuestbooks();
  }

  extractUserDetailsFromToken(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      this.displayName = payload.displayName || 'Unknown User';
    } catch (error) {
      console.error('Error decoding JWT:', error);
      this.displayName = 'Unknown User';
    }
  }

  fetchGuestbooks(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ guestbooks: Guestbook[]  }>(
      'http://localhost:3000/user/guestbookOverview',
      { headers }
    ).subscribe({
      next: (response) => {
        console.log('✅ Guestbook response:', response); // ✅ Debugging
        console.log(response.guestbooks)
        this.guestbooks = response.guestbooks; // ✅ Fix the data structure
      },
      error: (err) => {
        console.error('❌ Failed to fetch guestbooks:', err);
      },
    });
  }


  createGuestbook(): void {
    if (!this.newGuestbookName.trim()) {
      alert('Guestbook name cannot be empty!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<{ guestbook: Guestbook }>(
      'http://localhost:3000/user/createGuestbook',
      { name: this.newGuestbookName, designId: this.selectedDesignId }, // ✅ Send designId
      { headers }
    ).subscribe({
      next: (response) => {
        console.log('Current guestbooks:', this.guestbooks); // ✅ Debugging
        console.log('New guestbook:', response.guestbook); // ✅ Debugging

        if (!Array.isArray(this.guestbooks)) {
          console.error('guestbooks is not an array!', this.guestbooks);
          this.guestbooks = []; // ✅ Ensure guestbooks is an array
        }

        this.guestbooks.push(response.guestbook); // ✅ Add the new guestbook
        this.newGuestbookName = ''; // ✅ Clear input field
      },
      error: (err) => {
        console.error('Failed to create guestbook', err);
        alert('Failed to create guestbook');
      },
    });
  }

}
