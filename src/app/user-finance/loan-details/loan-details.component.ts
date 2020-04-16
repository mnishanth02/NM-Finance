import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserFinanceService } from "../user-finance.service";
import { UserData } from "../add-user-details/userData.model";

@Component({
  selector: "app-loan-details",
  templateUrl: "./loan-details.component.html",
  styleUrls: ["./loan-details.component.css"],
})
export class LoanDetailsComponent implements OnInit {
  isLoading = false;
  currentUserData: UserData;
  isDataAvailable: boolean = false;
  statusMsg = "";
  showSuccessMsg = false;
  showErrorMsg = false;
  currentUserId = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userFinanceService: UserFinanceService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data: { userData: any }) => {
      this.currentUserData = data.userData;
      this.currentUserId = data.userData._id;
      this.isDataAvailable = true;
    });
  }

  onDelete() {
    this.isLoading = true;
    console.log(this.currentUserId);
    this.userFinanceService.onDeleteUser(this.currentUserId).subscribe(() => {
      this.router.navigate(["/userFinance"]);
    });
  }
}
