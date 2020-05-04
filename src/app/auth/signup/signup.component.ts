import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private signUpSub: Subscription;
  signUpMsg = '';
  showSuccessMsg = false;
  showErrorMsg = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.signUpSub = this.authService.getloginSignUpSub().subscribe(data => {
      this.signUpMsg = data.message;
      if (data.status === 'success') {
        this.showSuccessMsg = true;
        this.isLoading = false;
      } else {
        this.showErrorMsg = true;
        this.isLoading = false;
      }
    });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.showErrorMsg = false;
    this.showSuccessMsg = false;
    this.authService.createUser(form.value.email, form.value.password);
    form.resetForm();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.signUpSub.unsubscribe();
  }
}
