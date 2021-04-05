import { BaseEntity } from './base-entity';
import { EmployeeNavModel } from './EmployeeNavModel';

export class EmployeeUpdateModel extends BaseEntity {
    employeeId: string;
    employeeName: string;
    email: string;
    phone: string;
    address: string;
    state:string;
    city: string;
    zipCode: string;
    organizationId: string;
    organizationName:string;
    designationId: string;
    designationName:string;
    isSupervisor: boolean;
    isActive:boolean;
    superVisorId: string;
    payType: string;
    payTypeCheck:boolean;
    pay: string;
    overTimeRate: string;
    employeepermissions: EmployeeNavModel[];

}