export enum UserRole {
  EMPLOYEE = 'Employee',
}

export interface User {
  _id: number;
  username: string;
  password: string;
  roles: UserRole[];
  active: boolean;
}
