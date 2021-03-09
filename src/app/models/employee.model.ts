import { BaseEntity } from './base-entity';
import { EmployeePermission } from './employeepermission.model';

export class EmployeeModel extends BaseEntity {
    employeeId: string;
    employeeName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    zipCode: string;
    organizationId: string;
    designationId: string;
    isSupervisor: boolean;
    superVisorId: string;
    payType: string;
    pay: string;
    overTimeRate: string;
    employeepermissions: EmployeePermission[];

}