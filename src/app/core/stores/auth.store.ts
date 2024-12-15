import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, LoginResponse } from '../services/auth.service';

export interface User {
  id?: string;
  username?: string;
  phoneNumber?: string;
  userType: 'admin' | 'student';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialState),

  withComputed((state) => ({
    isLoggedIn: computed(() => !!state.token()),
    isAdmin: computed(() => state.user()?.userType === 'admin')
  })),

  withMethods((store, authService = inject(AuthService), router = inject(Router)) => {
    return {
      logout() {
        patchState(store, {
          user: null,
          token: null,
          isLoading: false,
          error: null
        });
        localStorage.removeItem('token');
        router.navigate(['/login']);
      },

      loadCurrentUser: rxMethod<void>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true, error: null });
            authService.getCurrentUser().subscribe({
              next: (user) => {
                patchState(store, {
                  user,
                  isLoading: false
                });
              },
              error: (error) => {
                patchState(store, {
                  error: error.error?.message || 'Failed to load user',
                  isLoading: false
                });
              }
            });
          })
        )
      ),

      login: rxMethod<{
        credentials: { username: string; password: string };
        userType: 'admin' | 'student';
      }>(
        pipe(
          tap(() => {
            patchState(store, { isLoading: true, error: null });
          }),
          tap(({ credentials, userType }) => {
            authService.login(credentials, userType).subscribe({
              next: (response: LoginResponse) => {
                patchState(store, {
                  user: response.user,
                  token: response.access_token,
                  isLoading: false,
                  error: null
                });
                localStorage.setItem('token', response.access_token);
                router.navigate(['/dashboard']);
              },
              error: (error) => {
                patchState(store, {
                  isLoading: false,
                  error: error.error?.message || 'Login failed'
                });
              }
            });
          })
        )
      )
    };
  })
);
