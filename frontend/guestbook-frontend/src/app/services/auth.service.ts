import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/user'; // Update if needed

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password });
  }

  register(displayname: string, username: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, { displayname, username, password });
  }

  updatePassword(username: string, oldPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/update`, { username, oldPassword, newPassword });
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
