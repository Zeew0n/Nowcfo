import { BaseEntity } from './base-entity';

export class UserInformationModel extends BaseEntity {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phoneNumber: string;
  address:string;
  city:string;
  state:string;
  zipCode: string;
  roleId: string;
  role: string;
  status: string;
  password: string;
  confirmPassword:string;
  isActive: boolean;
  updatedDate: Date;
  createdDate: Date;
}