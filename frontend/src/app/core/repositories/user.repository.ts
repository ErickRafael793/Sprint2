import {
  RegisteredUser
} from '../models/registered-user.model';


export abstract class UserRepository {

  abstract getUsers():
    Promise<RegisteredUser[]>;

}