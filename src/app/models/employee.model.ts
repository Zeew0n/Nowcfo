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
    pay: boolean;
    overTimeRate: string;
    employeepermissions: EmployeePermission[];

}