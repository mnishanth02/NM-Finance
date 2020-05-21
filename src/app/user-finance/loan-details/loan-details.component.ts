import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFinanceService } from '../user-finance.service';
import { UserData } from '../add-user-details/userData.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteLoanDialogComponent } from './delete-loan.component';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css'],
})
export class LoanDetailsComponent implements OnInit, OnDestroy {
  isLoading = false;
  currentUserData: UserData;
  isDataAvailable = false;
  statusMsg = '';
  showSuccessMsg = false;
  showErrorMsg = false;
  currentUserDBId = '';
  userId: string;
  userIsAuthenticated = false;
  private authStatusSubs: Subscription;
  panelOpenState = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private userFinanceService: UserFinanceService,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });


    this.route.data.subscribe((data: { userData: any }) => {

      this.currentUserData = {
        id: data.userData?._id,
        prefix: data.userData.prefix,
        firstName: data.userData.prefix,
        lastName: data.userData.lastName,
        email: data.userData.email,
        dob: data.userData.dob,
        areaCode: data.userData.areaCode,
        city: data.userData.city,
        gender: data.userData.gender,
        martialStatus: data.userData.martialStatus,
        country: data.userData.country,
        addressLine1: data.userData.addressLine1,
        addressLine2: data.userData.addressLine2,
        state: data.userData.state,
        term: data.userData.term,
        creator: data.userData.creator,
        zip: data.userData.zip,
        mobileNumber: data.userData.mobileNumber,
        intrestRate: data.userData.intrestRate,
        loanAmount: data.userData.loanAmount,
        extraPayment: data.userData.extraPayment,
        loanStartDate: data.userData.loanStartDate,
        userProfilePic: data.userData.imagePath
      };
      this.currentUserDBId = data.userData?._id;
      this.isDataAvailable = true;
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeleteLoanDialogComponent, {
      data: {
        userName: this.currentUserData.firstName + ', ' + this.currentUserData.lastName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.isLoading = true;
        this.userFinanceService.onDeleteUser(this.currentUserDBId).subscribe(() => {
          this.router.navigate(['/userFinance']);
        }, () => {
          this.isLoading = false;
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}

