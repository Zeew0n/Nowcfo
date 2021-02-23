import { BaseEntity } from './base-entity';

export class OrganizationModel extends BaseEntity {
  organizationId: string;
  organizationName:string;
  isHeadOrganization:string;
  parentOrganizationId:string;
}