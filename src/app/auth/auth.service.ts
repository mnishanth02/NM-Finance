import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;

  private loginSignUpSubject = new Subject<{
    status: string;
    message: string;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expireseIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expireseIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expireseIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post<{ message: string; result: any }>(BACKEND_URL + "signup", authData)
      .subscribe(
        (response) => {
          console.log("serviuce response -> " + response.message);
          this.loginSignUpSubject.next({
            status: "success",
            message: "Sign Up Successful",
          });
        },
        (error) => {
          this.loginSignUpSubject.next({
            status: "error",
            message: "Error! Try after sometime",
          });
        }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(BACKEND_URL + "login", authData)
      .subscribe(
        (response) => {
          const tokenTemp = response.token;
          this.token = tokenTemp;
          if (tokenTemp) {
            const expiresInDuration = response.expiresIn;
            this.userId = response.userId;
            this.setAuthTimer(expiresInDuration);

            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.loginSignUpSubject.next({
              status: "success",
              message: "Login Successful",
            });

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(tokenTemp, expirationDate, this.userId);
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
          this.loginSignUpSubject.next({
            status: "error",
            message: "Error! Try after sometime",
          });
        }
      );
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/login"]);
  }

  getloginSignUpSub() {
    return this.loginSignUpSubject.asObservable();
  }

  private saveAuthData(token: string, expiresInDuration: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expiresInDuration.toISOString());
    localStorage.setItem("userId", userId);
  }

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expiriationDate = localStorage.getItem("expiration");
    const userIdTemp = localStorage.getItem("userId");
    if (!token || !expiriationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expiriationDate),
      userId: userIdTemp,
    };
  }
}
