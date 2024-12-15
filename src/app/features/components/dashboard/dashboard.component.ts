import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {StudentsStore} from '../../../core/stores/student.store';
import {AuthStore} from '../../../core/stores/auth.store';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatGridListModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private breakpointObserver = inject(BreakpointObserver);
  protected authStore = inject(AuthStore);
  protected studentsStore = inject(StudentsStore);

  cols$ = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
  ]).pipe(
    map(({ breakpoints }) => {
      if (breakpoints[Breakpoints.XSmall]) {
        return 1;
      } else if (breakpoints[Breakpoints.Small]) {
        return 2;
      } else if (breakpoints[Breakpoints.Medium]) {
        return 3;
      } else {
        return 4;
      }
    })
  );

  constructor() {
    this.authStore.loadCurrentUser();
    setTimeout(() => {
      console.log(this.authStore.user());
    }, 20000)
  }
}
