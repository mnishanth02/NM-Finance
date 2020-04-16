import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { NMDashboardComponent } from "./nm-dashboard/nm-dashboard.component";
import { UserFinanceComponent } from "./user-finance/user-finance.component";
import { UserDetailsListComponent } from './user-finance/user-details-list/user-details-list.component';
import { AddUserDetailsComponent } from './user-finance/add-user-details/add-user-details.component';
import { LoanDetailsComponent } from './user-finance/loan-details/loan-details.component';
import { LoanDetailsResolver } from './user-finance/loan-details/loan-details-resolver.service';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full", canActivate: [AuthGuard] },
  { path: "dashboard", component: NMDashboardComponent,  canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "userFinance",
    component: UserFinanceComponent,
    children: [
      {
        path: "",
        component: UserDetailsListComponent
      },
      {
        path: "loanDetails/:userId",
        component: LoanDetailsComponent,
        resolve: { userData: LoanDetailsResolver },
        canActivate: [AuthGuard]
      },
      {
        path: "addUser",
        component: AddUserDetailsComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
