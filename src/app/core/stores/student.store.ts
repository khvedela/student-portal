import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';
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
    order: 'asc'
  }
};

export const StudentsStore = signalStore(
  { providedIn: 'root' },
  withState<StudentsState>(initialState),

  withComputed(({ students, filter }) => ({
    sortedStudents: computed(() => {
      const direction = filter().order === 'asc' ? 1 : -1;

      return [...students()].sort((a, b) => {
        const nameA = (a.string_field_3 || '').toString();
        const nameB = (b.string_field_3 || '').toString();
        return direction * nameA.localeCompare(nameB);
      });
    }),

    filteredStudents: computed(() => {
      const query = filter().query.toLowerCase();
      const sortedStudents = computed(() => {
        const direction = filter().order === 'asc' ? 1 : -1;

        return [...students()].sort((a, b) => {
          const nameA = (a.string_field_3 || '').toString();
          const nameB = (b.string_field_3 || '').toString();
          return direction * nameA.localeCompare(nameB);
        });
      })();

      if (!query) return sortedStudents;

      return sortedStudents.filter(student => {
        const name = (student.string_field_3 || '').toString().toLowerCase();
        const phone = (student.string_field_4 || '').toString();
        return name.includes(query) || phone.includes(query);
      });
    })
  })),

  withMethods(() => {
    const studentsService = inject(StudentsService);

    return {
      updateFilter(store: StudentsState, filterUpdate: Partial<StudentsState['filter']>) {
        return {
          ...store,
          filter: {
            ...store.filter,
            ...filterUpdate
          }
        };
      },

      loadStudents: rxMethod<void>(
        pipe(
          tap(() => ({
            isLoading: true,
            error: null
          })),
          tap(() => {
            studentsService.getAllStudents().subscribe({
              next: (students) => ({
                students,
                isLoading: false
              }),
              error: (error) => ({
                error: error.message,
                isLoading: false
              })
            });
          })
        )
      )
    };
  })
);
