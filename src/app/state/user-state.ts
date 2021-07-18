import { User } from '../models/user';

interface IUserState extends User {
  restoringState: boolean;
  token?: string;
}

export default class UserState extends User implements IUserState {
  restoringState = false;
  token?: string;

  constructor(obj?: IUserState) {
    super(obj);
    if (obj) this.token = obj.token;
  }
}
