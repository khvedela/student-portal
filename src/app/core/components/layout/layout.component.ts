import {Component, inject} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {AsyncPipe, NgIf} from '@angular/common';
import {AuthStore} from '../../stores/auth.store';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenav,
    MatSidenavContainer,
    MatSidenavModule,
    MatToolbar,
    MatNavList,
    MatIcon,
    MatListItem,
    RouterLinkActive,
    RouterLink,
    MatIconButton,
    MatMenu,
    NgIf,
    MatMenuTrigger,
    MatMenuItem,
    RouterOutlet,
    AsyncPipe
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  protected authStore = inject(AuthStore);
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
}
