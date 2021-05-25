export interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  img: string;
  roles: string[];
  token: string;
}

export class User implements IUser {
  username: string;
  firstName: string;
  lastName: string;
  img: string;
  roles: string[];
  token: string;

  constructor(obj: IUser) {
    this.username = obj.username;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.img = obj.img;
    this.roles = obj.roles;
    this.token = obj.token;
  }
}