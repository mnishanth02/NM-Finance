export interface UserData {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  areaCode: string;
  mobileNumber: number;
  dob: Date;
  gender: string;
  martialStatus: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: number;
  country: string;
  creator: string;

  // Loan details
  loanAmount: number;
  intrestRate: number;
  term: number;
  loanStartDate: Date;

  userProfilePic: File | string;
}
