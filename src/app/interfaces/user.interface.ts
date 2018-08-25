export interface User {
  uid?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: number;
  password?: string;
  guestEvent?: any;
  isSP?: boolean;
  photoUrl?: string;
  eventRolesMap?: Map<string, number>;
}
