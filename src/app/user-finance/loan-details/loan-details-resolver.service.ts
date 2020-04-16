import { Injectable } from "@angular/core";

import { Resolve, RouterStateSnapshot } from "@angular/router";

import { ActivatedRouteSnapshot } from "@angular/router";
import { UserFinanceService } from "../user-finance.service";
import { Observable } from "rxjs";
import { UserData } from "../add-user-details/userData.model";

@Injectable()
export class LoanDetailsResolver implements Resolve<UserData> {
  constructor(private userFinanceService: UserFinanceService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserData> | Promise<UserData> | UserData {
    return this.userFinanceService.getUserById(route.paramMap.get("userId"));
  }
}
