import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loginSub: Subscription;
  loginMsg: string = ""; 
  showSuccessMsg: boolean = false;
  showErrorMsg: boolean = false;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginSub = this.authService.getloginSignUpSub().subscribe((data) => {
      this.loginMsg = data.message;
      if (data.status === "success") {
        this.showSuccessMsg = true;
      } else {
        this.isLoading = false;
        this.showErrorMsg = true;
      }
    });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.showErrorMsg = false;
    this.showSuccessMsg = false;
    console.log(form);
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}
