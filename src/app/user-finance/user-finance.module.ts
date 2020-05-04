import { NgModule } from '@angular/core';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { AddUserDetailsComponent } from './add-user-details/add-user-details.component';
import { UserDetailsListComponent } from './user-details-list/user-details-list.component';
import { UserFinanceComponent } from './user-finance.component';
import { MaterialModule } from '../material/material.module';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserFinanceComponent,
    UserDetailsListComponent,
    AddUserDetailsComponent,
    LoanDetailsComponent,
  ],
  imports: [CommonModule, MaterialModule, AppRoutingModule, FormsModule],
})
export class UserFinanceModule { }
