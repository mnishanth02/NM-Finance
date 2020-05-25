import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFinanceService } from '../user-finance.service';
import { UserData } from '../add-user-details/userData.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteLoanDialogComponent } from './delete-loan.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface PaymentDataMonthYearItem {
  year: number | string;
  month: string;
  emi: number;
  principal: number;
  interestPaid: number;
  endingBalance: number;
}


@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('220ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
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

  // Loan calculation
  loanAmount = 0.00;
  term = 0.00;
  intrestRate = 0.00;
  extraPayment = 0.00;
  loanStartDate = '';
  monthlyPayment = 0;
  totalPayment = 0;
  fieldsetDisabled = false;
  displayPaymetDetails = false;

  @ViewChild(MatTable) table: MatTable<Object>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //dataSourceMonth: MatTableDataSource<PaymentDataMonthYearItem>;
  //dataSourceYear: MatTableDataSource<PaymentDataMonthYearItem>;


  dataSourceYear = new MatTableDataSource<PaymentDataMonthYearItem>();
  dataSourceMonth = new MatTableDataSource<PaymentDataMonthYearItem>();


  //dataSource = new MatTableDataSource<PaymentDataTabelItem>();
  ELEMENT_DATA: PaymentDataMonthYearItem[] = [];

  columnsToDisplayYear: string[] = ['year', 'emi', 'principal', 'interestPaid', 'endingBalance'];
  columnsToDisplayYeara = [{ year: 'Year', emi: 'EMI', principal: 'Principal', interestPaid: 'Interest Paid', endingBalance: 'Balance' }];
  columnsToDisplayMonth: string[] = ['month', 'emi', 'principal', 'interestPaid', 'endingBalance'];
  expandedElement: PaymentDataMonthYearItem | null;

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
      // this.calculate(this.currentUserData.loanAmount, this.currentUserData.term * 12, this.currentUserData.intrestRate, this.currentUserData.extraPayment, 1);
      this.calculate(this.currentUserData.loanAmount, this.currentUserData.term, this.currentUserData.intrestRate, this.currentUserData.extraPayment);
      this.dataSourceYear.data = this.YEAR_ELEMENT_DATA;
      // this.dataSourceMonth.data = this.MONTH_ELEMENT_DATA
      this.isDataAvailable = true;
    });
  }  // ngInit END


  elementChanged(element) {

    if (element != null && element != '') {
      console.log(element.year);

      this.dataSourceMonth.data = this.MONTH_ELEMENT_DATA.filter(val => val.year === element.year);
    }

  }



  interest1 = 0;
  totalInterest1 = 0;
  totalAmount1 = 0;
  totalPrincipal1 = 0;
  endBalance1 = 0;
  yearTotal1 = 0;
  totalPrincipalYear1 = 0;
  //principalValue: number = 300000;
  //interestValue: number = 5.5;
  //months: number = 180;
  totalInterestYear1 = 0;

  beginBalance1 = 0;
  monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  dateValue: Date = new Date();
  dateObj: Date = new Date(this.dateValue.getTime());
  YEAR_ELEMENT_DATA: PaymentDataMonthYearItem[] = [];
  MONTH_ELEMENT_DATA: PaymentDataMonthYearItem[] = [];

  private calculate(principalValue, months, interestValue, extraPayment) {

    const emi1 = this.calculateEMI(principalValue, months, interestValue);

    for (let i: number = 0; i < months; i++) {
      const ratePerPeriod = interestValue / 100 / 12;
      this.interest1 = principalValue * ratePerPeriod;
      this.totalInterest1 += this.interest1;
      this.totalAmount1 += emi1;
      this.totalPrincipal1 += parseFloat((emi1 - this.interest1).toFixed(2));
      this.endBalance1 = principalValue - (emi1 - this.interest1);
      this.yearTotal1 += emi1;
      this.totalPrincipalYear1 += parseFloat((emi1 - this.interest1).toFixed(2));
      this.totalInterestYear1 += this.interest1;

      this.MONTH_ELEMENT_DATA.push({
        month: this.monthNames[this.dateObj.getMonth()],
        year: this.dateObj.getFullYear(),
        emi: this.roundTo(emi1, 2),
        principal: this.roundTo((emi1 - this.interest1), 2),
        interestPaid: this.roundTo(this.interest1, 2),
        endingBalance: this.roundTo(this.endBalance1, 2),
      });
      if (i === 0 || this.dateObj.getMonth() === 0) {
        this.beginBalance1 = principalValue;
      }
      if (this.dateObj.getMonth() === 11 || (i === months - 1)) {
        this.YEAR_ELEMENT_DATA.push({
          year: this.dateObj.getFullYear(), // year
          month: this.monthNames[this.dateObj.getMonth()],
          emi: this.roundTo(this.beginBalance1, 2),
          principal: this.roundTo(this.totalPrincipalYear1, 2),
          interestPaid: this.roundTo(this.totalInterestYear1, 2), // yearInterest
          endingBalance: this.roundTo(this.endBalance1, 2), // endingBalance
        });
        this.yearTotal1 = 0;
        this.totalPrincipalYear1 = 0;
        this.totalInterestYear1 = 0;
      }
      principalValue = this.endBalance1;
      if (i < months - 1) {
        this.dateObj.setMonth(this.dateObj.getMonth() + 1);
      }
    }
  }

  calculateEMI(principalValue, months, interestValue): number {
    let interestValue1: number = interestValue / 100 / 12;
    if (interestValue1) {
      return principalValue * interestValue1 *
        (Math.pow((1 + interestValue1), months)) / ((Math.pow((1 + interestValue1), months)) - 1);
    }
    return principalValue / months;
  }


  // private calculate(principal, months, rate, extra, yearOrMonth) {
  //   let numerator = 0;
  //   let denominator = 0;
  //   const ratePerPeriod = rate / 100 / 12;

  //   // if convert years to month
  //   if (!yearOrMonth) {
  //     numerator = buildNumerator(months * 12);
  //     denominator = Math.pow((1 + ratePerPeriod), months * 12) - 1;
  //     // for inputs in months
  //   } else if (yearOrMonth === 1) {
  //     numerator = buildNumerator(months)
  //     denominator = Math.pow((1 + ratePerPeriod), months) - 1;
  //   } else {
  //     console.log(' yearOrMonth not defined');
  //   }
  //   // build Numerator
  //   function buildNumerator(numInterestAccruals) {
  //     return ratePerPeriod * Math.pow((1 + ratePerPeriod), numInterestAccruals);
  //   }

  //   if (extra > 0) {
  //     this.monthlyPayment = (principal * (numerator / denominator)) + extra;
  //   } else {
  //     this.monthlyPayment = principal * (numerator / denominator);
  //   }

  //   this.totalPayment = this.roundTo(this.monthlyPayment + extra, 2);
  //   let currentBalance = +principal;
  //   let totalIntrest = 0;
  //   let paymentCounter = 1;
  //   let monthPay = this.monthlyPayment;

  //   while (currentBalance > 0) {

  //     let towardsIntrest = ratePerPeriod * currentBalance;  // portion of monthly payment goes towards intrest
  //     if (monthPay > currentBalance) {
  //       monthPay = currentBalance + towardsIntrest;
  //     }

  //     let towardsBalance = monthPay - towardsIntrest;
  //     totalIntrest = totalIntrest + towardsIntrest;
  //     currentBalance = currentBalance - towardsBalance;

  //     const paymentElement: PaymentDataTabelItem = {
  //       position: paymentCounter,
  //       payment: this.roundTo(monthPay, 2),
  //       year: 1,
  //       month: 'jan',
  //       principle: this.roundTo(towardsBalance, 2),
  //       intrest: this.roundTo(towardsIntrest, 2),
  //       intrestPaid: this.roundTo(totalIntrest, 2),
  //       balance: this.roundTo(currentBalance, 2)
  //     };

  //     paymentCounter++;

  //     // this.dataSource.data.push(paymentElement); 
  //     this.ELEMENT_DATA.push(paymentElement);
  //   }


  // }

  private roundTo(num, digits) {
    if (digits === undefined) {
      digits = 0;
    }
    const multiplicator = Math.pow(10, digits);
    num = parseFloat((num * multiplicator).toFixed(11));
    const test = (Math.round(num) / multiplicator);
    return +(test.toFixed(digits));
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

