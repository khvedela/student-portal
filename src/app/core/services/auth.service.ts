import { HttpClient } from '@angular/common/http';
import {computed, effect, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../stores/auth.store';

export interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }, userType: 'admin' | 'student'): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/${userType}/login`, credentials);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/profile`);
  }
}
