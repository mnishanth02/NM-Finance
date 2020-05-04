import { Injectable } from '@angular/core';
import { UserData } from './add-user-details/userData.model';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({
  providedIn: 'root',
})
export class UserFinanceService {
  private allUserDataList: UserData[] = [];
  private currentUserData: UserData;
  private addUserSubject = new Subject<{
    status: string;
    message: string;
  }>();
  private getAllUserSub = new Subject<{
    userList: UserData[];
    userListCount: number;
  }>();

  private userByIdSub = new Subject<{ userData: UserData }>();

  navigationLoadingSub = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  addNewUser(userDataTemp: UserData) {
    const userData = this.popuplateFormDate(userDataTemp);

    this.http
      .post<{ message: string; result: any }>(
        BACKEND_URL + 'addNewUser',
        userData
      )
      .subscribe(
        (response) => {
          if (response.message === 'success') {
            this.addUserSubject.next({
              status: 'success',
              message: 'User Added Successful',
            });
          } else {
            this.addUserSubject.next({
              status: 'error',
              message: 'Error! Try after sometime',
            });
          }
        },
        (error) => {
          this.addUserSubject.next({
            status: 'error',
            message: 'Error! Try after sometime',
          });
        }
      );
  }

  updateNewUser(userDataTemp: UserData) {
    const userData = this.popuplateFormDate(userDataTemp);

    this.http
      .put<{ message: string }>(
        BACKEND_URL + 'updateUser/' + userDataTemp.id,
        userData
      )
      .subscribe(
        (response) => {
          if (response.message === 'success') {
            this.getUserById(userDataTemp.id).subscribe((result) => {
              this.currentUserData = result;
              this.userByIdSub.next({ userData: this.currentUserData });
            });
            this.addUserSubject.next({
              status: 'success',
              message: 'User Modified Successfully',
            });
          } else {
            this.addUserSubject.next({
              status: 'error',
              message: 'Error! Try after sometime',
            });
          }
        },
        (error) => {
          this.addUserSubject.next({
            status: 'error',
            message: 'Error! Try after sometime',
          });
        }
      );
  }

  getUserByIdObservable() {
    return this.userByIdSub.asObservable();
  }
  getNewUserDataSub() {
    return this.addUserSubject.asObservable();
  }

  getAllUserList() {
    this.http
      .get<{ message: string; userList: any; count: number }>(
        BACKEND_URL + 'getAllUser'
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
    return this.http.get<any>(BACKEND_URL + 'getUserById/' + id);
  }

  private popuplateFormDate(data: UserData) {
    const userData = new FormData();
    userData.append('prefix', data.prefix);
    userData.append('firstName', data.firstName);
    userData.append('lastName', data.lastName);
    userData.append('email', data.email);
    userData.append('areaCode', data.areaCode);
    userData.append('gender', data.gender);
    userData.append('martialStatus', data.martialStatus);
    userData.append('addressLine1', data.addressLine1);
    userData.append('addressLine2', data.addressLine2);
    userData.append('dob', new Date(data.dob).toISOString());
    userData.append('mobileNumber', data.mobileNumber.toString());
    userData.append('city', data.city);
    userData.append('state', data.state);
    userData.append('zip', data.zip.toString());
    userData.append('country', data.country);
    userData.append('loanAmount', data.loanAmount.toString());
    userData.append('intrestRate', data.intrestRate.toString());
    userData.append('term', data.term.toString());
    userData.append(
      'loanStartDate',
      new Date(data.loanStartDate).toISOString()
    );
    userData.append('userProfilePic', data.userProfilePic);

    return userData;
  }

  onDeleteUser(id: string) {
    return this.http.delete(BACKEND_URL + 'deleteUser/' + id);
  }
}
