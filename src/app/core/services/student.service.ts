import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Student} from '../stores/student.store';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/users/students`);
  }
}
