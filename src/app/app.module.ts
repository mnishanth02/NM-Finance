import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MaterialModule } from "./material/material.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { NavComponent } from "./nav/nav.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { NMDashboardComponent } from "./nm-dashboard/nm-dashboard.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { UserFinanceComponent } from "./user-finance/user-finance.component";
import { UserDetailsListComponent } from "./user-finance/user-details-list/user-details-list.component";
import { AddUserDetailsComponent } from "./user-finance/add-user-details/add-user-details.component";
import { LoanDetailsComponent } from "./user-finance/loan-details/loan-details.component";
import { LoanDetailsResolver } from "./user-finance/loan-details/loan-details-resolver.service";
import { AuthInterceptor } from "./auth/auth-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LandingPageComponent,
    NMDashboardComponent,
    LoginComponent,
    SignupComponent,
    UserFinanceComponent,
    UserDetailsListComponent,
    AddUserDetailsComponent,
    LoanDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    LoanDetailsResolver,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}