import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthStore} from '../../../../core/stores/auth.store';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    ReactiveFormsModule,
    MatButtonToggleGroup,
    FormsModule,
    MatButtonToggle,
    MatFormField,
    MatInput,
    MatIcon,
    MatIconButton,
    MatButton,
    MatProgressSpinner,
    MatLabel,
    MatCardTitle
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  protected authStore = inject(AuthStore);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  userType: 'admin' | 'student' = 'student';
  hidePassword = true;

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authStore.login({
        credentials: this.loginForm.value,
        userType: this.userType
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    return '';
  }
}
