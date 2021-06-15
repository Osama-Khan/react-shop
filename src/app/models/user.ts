export interface IUser {
  id: number | undefined;
  username: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  img: string | undefined;
  roles: string[] | undefined;
  token: string | undefined;
  dateOfBirth: Date | undefined;
  profileImage: string | undefined;
}

export class User implements IUser {
  id: number | undefined;
  username: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  img: string | undefined;
  roles: string[] | undefined;
  token: string | undefined;
  dateOfBirth: Date | undefined;
  profileImage: string | undefined;

  constructor(obj?: IUser) {
    if (obj) {
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
}
