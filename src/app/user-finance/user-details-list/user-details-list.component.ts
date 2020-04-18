import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { UserFinanceService } from "../user-finance.service";
import { UserData } from "../add-user-details/userData.model";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-user-details-list",
  templateUrl: "./user-details-list.component.html",
  styleUrls: ["./user-details-list.component.css"],
  animations: [
    trigger("userListAnimation", [
      transition("* => *", [
        query(":enter", style({ opacity: 0 }), { optional: true }),
        query(
          ":enter",
          stagger("50ms", [
            animate(
              ".5s ease-in",
              keyframes([
                style({
                  opacity: 0,
                  transform: "translateY(-75px)",
                  offset: 0,
                }),
                style({
                  opacity: 0.0,
                  transform: "translateY(35px)",
                  offset: 0.3,
                }),
                style({ opacity: 1, transform: "translateY(0)", offset: 1 }),
              ])
            ),
          ]),
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class UserDetailsListComponent implements OnInit, OnDestroy {
  userLists: UserData[] = [];
  private userSub: Subscription;
  userDataListTotalCount = 0;
  isLoading = false;
  userId: string;
  private authStatusSubs: Subscription;
  userIsAuthenticated = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userFinService: UserFinanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userFinService.navigationLoadingSub.subscribe((status) => {
      if (status === true) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });
    this.userId = this.authService.getUserId();
    this.isLoading = true;
    this.userFinService.getAllUserList();
    this.userSub = this.userFinService.getAllUserListSub().subscribe((data) => {
      this.isLoading = false;
      this.userLists = data.userList;
      this.userDataListTotalCount = data.userListCount;
      console.log(this.userLists);
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
