import { BaseEntity } from './base-entity';

export class AppUserModel extends BaseEntity {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    updateDate: Date;
    createDate: Date;
}
