import { BaseEntity } from './base-entity';

export class OrganizationModel extends BaseEntity {
  organizationId: number;
  organizationName: string;
  hasParent: boolean;
  parentOrganizationId: number;
  parentOrganization: string;
}
