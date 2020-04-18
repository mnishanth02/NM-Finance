import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserData } from "./userData.model";
import { UserFinanceService } from "../user-finance.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { UserDataResolve } from "./User-Data-resolver.service";

@Component({
  selector: "app-add-user-details",
  templateUrl: "./add-user-details.component.html",
  styleUrls: ["./add-user-details.component.css"],
})
export class AddUserDetailsComponent implements OnInit {
  isLoading = false;
  private addUserSub: Subscription;
  currentUserData: UserData;
  currentUserDBId = null;
  isDataAvailable = true;
  mode: string = "create";
  statusMsg = "";
  showSuccessMsg = false;
  showErrorMsg = false;
  imagePreview: string;
  showDefaultImage: boolean = true;
  selectedFile: File = null;

  constructor(
    private userFinanceService: UserFinanceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("userId")) {
        this.route.data.subscribe((data: { userData: any }) => {
          this.currentUserData = data.userData;
          this.currentUserDBId = data.userData?._id;
          this.isDataAvailable = true;
          this.mode = "edit";
        });
      } else {
        this.mode = "create";
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
        if (data.status === "success") {
          this.showSuccessMsg = true;
        } else {
          this.showErrorMsg = true;
        }
        // this.mode = "create";
        this.isLoading = false;
      });
  }

  prefixs = [
    { id: "Mr", name: "Mr" },
    { id: "Mrs", name: "Mrs" },
    { id: "Ms", name: "Ms" },
  ];

  genders = [
    { id: "Male", name: "Male" },
    { id: "Female", name: "Female" },
    { id: "Others", name: "Others" },
  ];
  martialStatuses = [
    { id: "Married", name: "Married" },
    { id: "Un Married", name: "Un Married" },
    { id: "Others", name: "Others" },
  ];

  citys = [
    { id: "Coimbatore", name: "Coimbatore" },
    { id: "Chennai", name: "Chennai" },
    { id: "Goa", name: "Goa" },
    { id: "Others", name: "Others" },
  ];

  states = [
    { id: "Tamil Nadu", name: "Tamil Nadu" },
    { id: "Kerala", name: "Kerala" },
    { id: "Delhi", name: "Delhi" },
    { id: "Others", name: "Others" },
  ];

  onImagePicked(event) {
    this.selectedFile = <File>event.target.files[0];

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
      loanAmount: form.value.loanAmount,
      intrestRate: form.value.intrestRate,
      term: form.value.term,
      loanStartDate: form.value.loanStartDate,
      creator: null,
      userProfilePic: this.selectedFile,
    };
    console.log("User Data Submitted- > " + userDataTemp);
    this.showErrorMsg = false;
    this.showSuccessMsg = false;
    if (this.mode == "edit") {
      this.userFinanceService.updateNewUser(userDataTemp);
      this.showDefaultImage = false;
      // this.currentUserData = this.userFinanceService.get
    } else {
      this.userFinanceService.addNewUser(userDataTemp);
      this.showDefaultImage = true;
      form.resetForm();
    }
  }
}
