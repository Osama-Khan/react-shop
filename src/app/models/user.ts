export interface IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  img: string;
  roles: string[];
  token: string;
  dateOfBirth: Date;
  profileImage: string;
}

export class User implements IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  img: string;
  roles: string[];
  token: string;
  dateOfBirth: Date;
  profileImage: string;

  constructor(obj: IUser) {
    this.id = obj.id;
    this.username = obj.username;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.img = obj.img;
    this.roles = obj.roles;
    this.token = obj.token;
    this.dateOfBirth = obj.dateOfBirth;
    this.profileImage = obj.profileImage;
  }
}