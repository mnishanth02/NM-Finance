import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NMDashboardComponent } from './nm-dashboard/nm-dashboard.component';
import { UserFinanceComponent } from './user-finance/user-finance.component';
import { UserDetailsListComponent } from './user-finance/user-details-list/user-details-list.component';
import { AddUserDetailsComponent } from './user-finance/add-user-details/add-user-details.component';
import { LoanDetailsComponent } from './user-finance/loan-details/loan-details.component';
import { AuthGuard } from './auth/auth-guard';
import { UserDataResolve } from './user-finance/add-user-details/User-Data-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: NMDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  }, //lazy loading
  {
    path: 'userFinance',
    component: UserFinanceComponent,
    children: [
      {
        path: '',
        component: UserDetailsListComponent,
      },
      {
        path: 'edit/:userId',
        component: AddUserDetailsComponent,
        resolve: { userData: UserDataResolve },
        canActivate: [AuthGuard],
      },
      {
        path: 'loanDetails/:userId',
        component: LoanDetailsComponent,
        resolve: { userData: UserDataResolve },
        canActivate: [AuthGuard],
      },
      {
        path: 'addUser',
        component: AddUserDetailsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
