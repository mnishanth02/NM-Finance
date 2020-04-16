import { Injectable } from "@angular/core";
import { UserData } from "./add-user-details/userData.model";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";

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
    const userData = new FormData();
    userData.append("prefix", userDataTemp.prefix);
    userData.append("firstName", userDataTemp.firstName);
    userData.append("lastName", userDataTemp.lastName);
    userData.append("email", userDataTemp.email);
    userData.append("areaCode", userDataTemp.areaCode);
    userData.append("gender", userDataTemp.gender);
    userData.append("martialStatus", userDataTemp.martialStatus);
    userData.append("addresLine1", userDataTemp.addresLine1);
    userData.append("addresLine2", userDataTemp.addresLine2);
    userData.append("dob", userDataTemp.dob);
    userData.append("mobileNumber", userDataTemp.mobileNumber.toString());
    userData.append("city", userDataTemp.city);
    userData.append("state", userDataTemp.state);
    userData.append("zip", userDataTemp.zip.toString());
    userData.append("country", userDataTemp.country);
    userData.append("loanAmount", userDataTemp.loanAmount.toString());
    userData.append("intrestRate", userDataTemp.intrestRate.toString());
    userData.append("term", userDataTemp.term.toString());
    userData.append("loanStartDate", userDataTemp.loanStartDate);

    userData.append("userProfilePic", userDataTemp.userProfilePic);

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
                addresLine1: userList.addresLine1,
                addresLine2: userList.addresLine2,
                city: userList.city,
                state: userList.state,
                zip: userList.zip,
                country: userList.country,
                creator: userList.creator,
                userProfilePic: userList.imagePath
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
      addresLine1: string;
      addresLine2: string;
      city: string;
      state: string;
      zip: number;
      country: string;
    }>("http://localhost:3000/api/user/getUserById/" + id);
  }

  onDeleteUser(id: string) {
    return this.http.delete("http://localhost:3000/api/user/deleteUser/" + id);
  }
}
