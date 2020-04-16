export interface UserData {
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

  // Loan details
  loanAmount: number;
  intrestRate:number;
  term: number;
  loanStartDate: string

  userProfilePic: File | string

}
