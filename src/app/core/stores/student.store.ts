import { computed } from '@angular/core';
import {signalStore, withState, withComputed, withMethods, patchState} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, map, catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { StudentsService } from '../services/student.service';

export interface Student {
  id: string;
  timestamp: string;
  name: string;
  phoneNumber: string;
  alternativePhone: string;
  parentName: string;
}

interface StudentsState {
  students: any[];
  isLoading: boolean;
  error: string | null;
  filter: {
    query: string;
    order: 'asc' | 'desc';
  };
}

const initialState: StudentsState = {
  students: [],
  isLoading: false,
  error: null,
  filter: {
    query: '',
    order: 'asc',
  },
};

export const StudentsStore = signalStore(
  { providedIn: 'root' },
  withState<StudentsState>(initialState),

  withComputed(({ students, filter }) => ({
    sortedStudents: computed(() => {
      const direction = filter().order === 'asc' ? 1 : -1;
      return [...students()].sort((a, b) => {
        const nameA = (a.name || '').toString();
        const nameB = (b.name || '').toString();
        return direction * nameA.localeCompare(nameB);
      });
    }),

    filteredStudents: computed(() => {
      const query = filter().query.toLowerCase();
      const sortedStudents = [...students()].sort((a, b) => {
        const nameA = (a.name || '').toString();
        const nameB = (b.name || '').toString();
        return filter().order === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });

      if (!query) return sortedStudents;

      return sortedStudents.filter((student) => {
        const name = (student.name || '').toLowerCase();
        const phone = (student.phoneNumber || '').toString();
        return name.includes(query) || phone.includes(query);
      });
    }),
  })),

  withMethods((store, studentsService = inject(StudentsService)) => ({
    // Update the filter with patchState
    updateFilter(filterUpdate: Partial<StudentsState['filter']>) {
      patchState(store, {
        filter: {
          ...store.filter as any,
          ...filterUpdate,
        },
      });
    },

    // Load students and update state reactively
    loadStudents: rxMethod<void>(
      pipe(
        // Set initial state to loading
        tap(() =>
          patchState(store, {
            isLoading: true,
            error: null,
          })
        ),
        // Fetch students from the service
        switchMap(() =>
          studentsService.getAllStudents().pipe(
            // On success, update students and stop loading
            tap((students) =>
              patchState(store, {
                students,
                isLoading: false,
              })
            ),
            // On error, set error message and stop loading
            catchError((error) =>
              of(
                patchState(store, {
                  error: error.message,
                  isLoading: false,
                })
              )
            )
          )
        )
      )
    ),
  }))
);
