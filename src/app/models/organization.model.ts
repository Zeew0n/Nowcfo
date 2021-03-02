import { BaseEntity } from './base-entity';

export class OrganizationModel extends BaseEntity {
  organizationId: string;
  organizationName: string;
  hasParent: string;
  parentOrganizationId: string;
  parentOrganization: string;
}
