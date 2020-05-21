import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserData } from './userData.model';
import { UserFinanceService } from '../user-finance.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { MatTable } from '@angular/material/table';
import { PaymentDataTabelDataSource, PaymentDataTabelItem } from './payment-data-tabel-datasource';



@Component({
  selector: 'app-add-user-details',
  templateUrl: './add-user-details.component.html',
  styleUrls: ['./add-user-details.component.css'],
})
export class AddUserDetailsComponent implements OnInit, OnDestroy {
  isLoading = false;
  private addUserSub: Subscription;
  currentUserData: UserData;
  currentUserDBId = null;
  isDataAvailable = true;
  mode = 'create';
  statusMsg = '';
  showSuccessMsg = false;
  showErrorMsg = false;
  imagePreview: string;
  showDefaultImage = true;
  selectedFile: File = null;

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
  // paymentDataSource  = new PaymentDataTabelDataSource();

  @ViewChild('addUserForm') userForm?: NgForm;
  @ViewChild('loanForm') loanForm?: NgForm;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<PaymentDataTabelItem>;
  dataSource: PaymentDataTabelDataSource;
  // ELEMENT_DATA: PaymentElement[] = [];

  displayedColumns: string[] = ['position', 'payment', 'principle', 'intrest', 'intrestPaid', 'balance'];
  // dataSource = new MatTableDataSource<PaymentElement>();

  constructor(
    private userFinanceService: UserFinanceService,
    private route: ActivatedRoute,
  ) { }
  prefixs = [
    { id: 'Mr', name: 'Mr' },
    { id: 'Mrs', name: 'Mrs' },
    { id: 'Ms', name: 'Ms' },
  ];
  genders = [
    { id: 'Male', name: 'Male' },
    { id: 'Female', name: 'Female' },
    { id: 'Others', name: 'Others' },
  ];
  martialStatuses = [
    { id: 'Married', name: 'Married' },
    { id: 'Un Married', name: 'Un Married' },
    { id: 'Others', name: 'Others' },
  ];
  citys = [
    { id: 'Coimbatore', name: 'Coimbatore' },
    { id: 'Chennai', name: 'Chennai' },
    { id: 'Goa', name: 'Goa' },
    { id: 'Others', name: 'Others' },
  ];
  states = [
    { id: 'Tamil Nadu', name: 'Tamil Nadu' },
    { id: 'Kerala', name: 'Kerala' },
    { id: 'Delhi', name: 'Delhi' },
    { id: 'Others', name: 'Others' },
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.route.data.subscribe((data: { userData: any }) => {
          this.currentUserDBId = data.userData?._id;
          this.isDataAvailable = true;
          this.showDefaultImage = false;
          this.mode = 'edit';

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
          if (this.mode === 'edit') {
            this.fieldsetDisabled = true;

          }
          console.log('currentUserData-> ' + this.currentUserData);
        });
      } else {
        this.mode = 'create';
        this.currentUserDBId = null;
      }
    });
    this.userFinanceService.getUserByIdObservable().subscribe((result) => {
      this.currentUserData = result.userData;
    });

    this.addUserSub = this.userFinanceService
      .getNewUserDataSub()
      .subscribe((data) => {
        this.statusMsg = data.message;
        if (data.status === 'success') {
          this.showSuccessMsg = true;
        } else {
          this.showErrorMsg = true;
        }
        this.isLoading = false;
      });
  } // ngOnInit END

  // enableEdit() {
  //   this.fieldsetDisabled = false;
  // }

  private calculate(amount, months, rate, extra) {


    const i = rate / 100;
    this.monthlyPayment = amount * (i / 12) * Math.pow((1 + i / 12), months) / (Math.pow((1 + i / 12), months) - 1);
    this.totalPayment = this.roundTo(this.monthlyPayment + extra, 2);
    // let currentBalance = +amount;
    // let totalIntrest = 0;
    // let paymentCounter = 1;
    this.monthlyPayment = this.roundTo(this.monthlyPayment + extra, 2);
    // while (currentBalance > 0) {

    //   const towardsIntrest = (i / 12) * +currentBalance;

    //   if (this.monthlyPayment > currentBalance) {
    //     this.monthlyPayment = this.roundTo(currentBalance + towardsIntrest, 2);
    //   }
    //   const towardsBalance = +this.monthlyPayment - +towardsIntrest;
    //   totalIntrest = totalIntrest + towardsIntrest;
    //   currentBalance = +currentBalance - +towardsBalance;

    //   const paymentElement: PaymentDataTabelItem = {
    //     position: paymentCounter,
    //     payment: this.roundTo(this.monthlyPayment, 2),
    //     principle: this.roundTo(towardsBalance, 2),
    //     intrest: this.roundTo(towardsIntrest, 2),
    //     intrestPaid: this.roundTo(totalIntrest, 2),
    //     balance: this.roundTo(currentBalance, 2)
    //   };

    //   paymentCounter++;
    //   this.dataSource.data.push(paymentElement);


    // }

  }

  private roundTo(num, digits) {
    if (digits === undefined) {
      digits = 0;
    }
    const multiplicator = Math.pow(10, digits);
    num = parseFloat((num * multiplicator).toFixed(11));
    const test = (Math.round(num) / multiplicator);
    return +(test.toFixed(digits));
  }

  loadPaymentDetails(event) {

    console.log(event);

    if (event.name !== '' && event.name === 'loanAmount') {
      this.loanAmount = parseFloat(event.value);
    }
    if (event.name !== '' && event.name === 'intrestRate') {
      this.intrestRate = parseFloat(event.value);
    }
    if (event.name !== '' && event.name === 'term') {
      this.term = parseFloat(event.value) * 12;
    }
    if (event.name !== '' && event.name === 'extraPayment') {
      this.extraPayment = parseFloat(event.value);
    }
    if (this.loanAmount > 0 && this.intrestRate > 0 && this.term > 0) {
      this.dataSource = new PaymentDataTabelDataSource();
      this.calculate(this.loanAmount, this.term, this.intrestRate, this.extraPayment);
      // this.displayPaymetDetails = true;
    }
  }















  onImagePicked(event) {
    this.selectedFile = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.showDefaultImage = false;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  addNewUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const userDataTemp: UserData = {
      id: this.currentUserDBId != null ? this.currentUserDBId : null,
      prefix: form.value.namePrefix,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      areaCode: form.value.areaCode,
      mobileNumber: form.value.mobileNumber,
      dob: form.value.dob,
      gender: form.value.gender,
      martialStatus: form.value.martialStatus,
      addressLine1: form.value.addressLine1,
      addressLine2: form.value.addressLine2,
      city: form.value.city,
      state: form.value.state,
      zip: form.value.zip,
      country: form.value.country,
      creator: null,
      userProfilePic: this.selectedFile,
      loanAmount: form.value.loanAmount,
      intrestRate: form.value.intrestRate,
      term: form.value.term,
      extraPayment: form.value.extraPayment,
      loanStartDate: form.value.loanStartDate,
    };
    console.log('User Data Submitted- > ' + userDataTemp);
    this.showErrorMsg = false;
    this.showSuccessMsg = false;
    if (this.mode === 'edit') {
      this.userFinanceService.updateNewUser(userDataTemp);
      this.showDefaultImage = false;
      // this.currentUserData = this.userFinanceService.get
    } else {
      this.userFinanceService.addNewUser(userDataTemp);
      this.showDefaultImage = true;
      form.resetForm();
    }
  }


  ngOnDestroy() {
    this.addUserSub.unsubscribe();
  }
}
