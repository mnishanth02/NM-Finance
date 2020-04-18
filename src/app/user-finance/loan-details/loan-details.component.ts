import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserFinanceService } from "../user-finance.service";
import { UserData } from "../add-user-details/userData.model";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-loan-details",
  templateUrl: "./loan-details.component.html",
  styleUrls: ["./loan-details.component.css"],
})
export class LoanDetailsComponent implements OnInit, OnDestroy {
  isLoading = false;
  currentUserData: UserData;
  isDataAvailable: boolean = false;
  statusMsg = "";
  showSuccessMsg = false;
  showErrorMsg = false;
  currentUserDBId = "";
  userId: string;
  userIsAuthenticated = false;
  private authStatusSubs: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userFinanceService: UserFinanceService,
    private authService: AuthService
  ) {}

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
      this.currentUserData = data.userData;
      this.currentUserDBId = data.userData._id;
      this.isDataAvailable = true;
    });
  }

  onDelete() {
    this.isLoading = true;
    console.log(this.currentUserDBId);
    this.userFinanceService.onDeleteUser(this.currentUserDBId).subscribe(() => {
      this.router.navigate(["/userFinance"]);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
