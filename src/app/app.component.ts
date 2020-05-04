import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { UserFinanceService } from './user-finance/user-finance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'NM Finance';
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userFinanceService: UserFinanceService
  ) {
    router.events.subscribe((routerEvent: RouterEvent) => {
      this.checkRouterEvent(routerEvent);
    });
  }
  ngOnInit() {
    this.authService.autoAuthUser();
  }

  checkRouterEvent(routerEvent: RouterEvent): void {
    if (routerEvent instanceof NavigationStart) {
      this.userFinanceService.navigationLoadingSub.next(true);
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.userFinanceService.navigationLoadingSub.next(false);
    }
  }
}
