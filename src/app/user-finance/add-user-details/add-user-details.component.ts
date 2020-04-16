import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserData } from "./userData.model";
import { UserFinanceService } from "../user-finance.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-add-user-details",
  templateUrl: "./add-user-details.component.html",
  styleUrls: ["./add-user-details.component.css"],
})
export class AddUserDetailsComponent implements OnInit {
  isLoading = false;
  private addUserSub: Subscription;
  constructor(private userFinanceService: UserFinanceService) {}
  statusMsg = "";
  showSuccessMsg = false;
  showErrorMsg = false;
  imagePreview: string;
  showDefaultImage: boolean = true;

  selectedFile: File = null

  // Slider
  // The principal Slider binding properties
  public principalValue: number = 0;
  public principalMinValue: number = 0;
  public principalMaxValue: number = 500000;
  public principalStep: number = 10000;
  public principalType: string = "MinRange";

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 500000;
  min = 10000;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;
  tickInterval = 1;

  getSliderTickInterval(): number | "auto" {
    if (this.showTicks) {
      return this.autoTicks ? "auto" : this.tickInterval;
    }

    return 0;
  }

  ngOnInit(): void {
    this.addUserSub = this.userFinanceService
      .getNewUserDataSub()
      .subscribe((data) => {
        this.statusMsg = data.message;
        if (data.status === "success") {
          this.showSuccessMsg = true;
        } else {
          this.showErrorMsg = true;
        }
        this.isLoading = false;
      });
  }

  prefixs = [
    { value: "mr", viewValue: "Mr" },
    { value: "mrs", viewValue: "Mrs" },
    { value: "ms", viewValue: "Ms" },
  ];

  genders = [
    { value: "male", viewValue: "Male" },
    { value: "female", viewValue: "Female" },
    { value: "others", viewValue: "Others" },
  ];
  martialStatuses = [
    { value: "married", viewValue: "Married" },
    { value: "unmarried", viewValue: "Un Married" },
    { value: "others", viewValue: "Others" },
  ];

  citys = [
    { value: "coimbatore", viewValue: "coimbatore" },
    { value: "chennai", viewValue: "Chennai" },
    { value: "goa", viewValue: "Goa" },
    { value: "others", viewValue: "Others" },
  ];

  states = [
    { value: "tamilNadu", viewValue: "Tamil Nadu" },
    { value: "kerala", viewValue: "Kerala" },
    { value: "delhi", viewValue: "Delhi" },
    { value: "others", viewValue: "Others" },
  ];

  onImagePicked(event) {

    this.selectedFile = <File> event.target.files[0];
    console.log(event);
    console.log("selected File - "+ this.selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.showDefaultImage= false;
    };
    reader.readAsDataURL(this.selectedFile);
  }


  addNewUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const userDataTemp: UserData = {
      id: null,
      prefix: form.value.namePrefix,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      areaCode: form.value.areaCode,
      mobileNumber: form.value.mobileNumber,
      dob: form.value.dob,
      gender: form.value.gender,
      martialStatus: form.value.martialStatus,
      addresLine1: form.value.addressLine1,
      addresLine2: form.value.addressLine2,
      city: form.value.city,
      state: form.value.state,
      zip: form.value.zip,
      country: form.value.country,
      loanAmount: form.value.loanAmount,
      intrestRate: form.value.intrestRate,
      term: form.value.term,
      loanStartDate: form.value.loanStartDate,
      userProfilePic: this.selectedFile,
      
    };
    console.log("User Data Submitted- > "+ userDataTemp);
    this.showErrorMsg = false;
    this.showSuccessMsg = false;
    this.userFinanceService.addNewUser(userDataTemp);
    this.showDefaultImage= true;
    form.resetForm();
  }
}
