import { Injectable } from "@angular/core";
import { UserData } from "./add-user-details/userData.model";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { error } from '@angular/compiler/src/util';

@Injectable({
  providedIn: "root",
})
export class UserFinanceService {
  private allUserDataList: UserData[] = [];
  private addUserSubject = new Subject<{
    status: string;
    message: string;
  }>();
  private getAllUserSub = new Subject<{
    userList: UserData[];
    userListCount: number;
  }>();

  navigationLoadingSub = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  addNewUser(userDataTemp: UserData) {
    const userData = this.popuplateFormDate(userDataTemp);

    this.http
      .post<{ message: string; result: any }>(
        "http://localhost:3000/api/user/addNewUser",
        userData
      )
      .subscribe(
        (response) => {
          if (response.message === "success") {
            this.addUserSubject.next({
              status: "success",
              message: "User Added Successful",
            });
          } else {
            this.addUserSubject.next({
              status: "error",
              message: "Error! Try after sometime",
            });
          }
        },
        (error) => {
          this.addUserSubject.next({
            status: "error",
            message: "Error! Try after sometime",
          });
        }
      );
  }

  updateNewUser(userDataTemp: UserData) {

    const userData = this.popuplateFormDate(userDataTemp);

    this.http.put<{message: string}>("http://localhost:3000/api/user/updateUser/"+ userDataTemp.id, userData).subscribe(
      (response) => {
        if (response.message === "success") {
          this.addUserSubject.next({
            status: "success",
            message: "User Modified Successfully",
          });
        } else {
          this.addUserSubject.next({
            status: "error",
            message: "Error! Try after sometime",
          });
        }
      },
      (error) => {
        this.addUserSubject.next({
          status: "error",
          message: "Error! Try after sometime",
        });
      }
    );
  }
  getNewUserDataSub() {
    return this.addUserSubject.asObservable();
  }

  getAllUserList() {
    this.http
      .get<{ message: string; userList: any; count: number }>(
        "http://localhost:3000/api/user/getAllUser"
      )
      .pipe(
        map((list) => {
          return {
            userDataList: list.userList.map((userList) => {
              return {
                id: userList._id,
                prefix: userList.prefix,
                firstName: userList.firstName,
                lastName: userList.lastName,
                email: userList.email,
                areaCode: userList.areaCode,
                mobileNumber: userList.mobileNumber,
                dob: userList.dob,
                gender: userList.gender,
                martialStatus: userList.martialStatus,
                addressLine1: userList.addressLine1,
                addressLine2: userList.addressLine2,
                city: userList.city,
                state: userList.state,
                zip: userList.zip,
                country: userList.country,
                loanAmount: userList.loanAmount,
                intrestRate: userList.intrestRate,
                term: userList.term,
                loanStartDate: userList.loanStartDate,
                creator: userList.creator,
                userProfilePic: userList.imagePath,
              };
            }),
            userListCount: list.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.allUserDataList = transformedData.userDataList;
        this.getAllUserSub.next({
          userList: [...this.allUserDataList],
          userListCount: transformedData.userListCount,
        });
      });
  }

  getAllUserListSub() {
    return this.getAllUserSub.asObservable();
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<{
      id: string;
      prefix: string;
      firstName: string;
      lastName: string;
      email: string;
      areaCode: string;
      mobileNumber: number;
      dob: string;
      gender: string;
      martialStatus: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      zip: number;
      country: string;
      creator: string;
      loanAmount: number;
      intrestRate: number;
      term: number;
      loanStartDate: string;
      userProfilePic: File | string;
    }>("http://localhost:3000/api/user/getUserById/" + id);
  }

  private popuplateFormDate(data: UserData) {
    
    const userData = new FormData();
    userData.append("prefix", data.prefix);
    userData.append("firstName", data.firstName);
    userData.append("lastName", data.lastName);
    userData.append("email", data.email);
    userData.append("areaCode", data.areaCode);
    userData.append("gender", data.gender);
    userData.append("martialStatus", data.martialStatus);
    userData.append("addressLine1", data.addressLine1);
    userData.append("addressLine2", data.addressLine2);
    userData.append("dob", new Date(data.dob).toISOString());
    userData.append("mobileNumber", data.mobileNumber.toString());
    userData.append("city", data.city);
    userData.append("state", data.state);
    userData.append("zip", data.zip.toString());
    userData.append("country", data.country);
    userData.append("loanAmount", data.loanAmount.toString());
    userData.append("intrestRate", data.intrestRate.toString());
    userData.append("term", data.term.toString());
    userData.append("loanStartDate", new Date(data.loanStartDate).toISOString());
    userData.append("userProfilePic", data.userProfilePic);
    
    return userData;
  }

  onDeleteUser(id: string) {
    return this.http.delete("http://localhost:3000/api/user/deleteUser/" + id);
  }
}
