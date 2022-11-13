import { Model } from './Model';

export class User extends Model {

  override className = 'User';

  id: any = null;
  firstName = '';
  lastName = '';
  mobileNumber = '';
  email = '';
  image = '';
  accessToken = null;

  get getId() {
    return this.id;
  }

  get getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  get getProfileImage() {
    if (this.image === undefined || this.image === null || this.image === '') {
      return "/assets/images/icons/dummy-user.jpg";
    }

    return this.image;
  }

}
