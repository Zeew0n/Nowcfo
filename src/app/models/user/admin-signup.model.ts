import { BaseEntity } from "../base-entity";


export class AdminSignUpModel extends BaseEntity {
    id: string;
    userName: string;
    password: string;
    confirmPassword: string;
    token:string;
  }