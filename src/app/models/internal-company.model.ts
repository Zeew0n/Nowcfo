import { BaseEntity } from './base-entity';

export class InternalCompanyModel extends BaseEntity {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phoneNumber: string;
  roleId: string;
  role: string;
  status: string;
  tenantId: string;
  organizationName:string;
  password: string;
  confirmPassword:string;
  isActive: boolean;
  updatedDate: Date;
  createdDate: Date;
}

export class InternalCompanyResourceModel extends BaseEntity {
  name: string;
  resourceCount: number;
  resourceName: string;
  resourceRouteLink: string;
}
