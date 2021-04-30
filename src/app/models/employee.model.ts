import { BaseEntity } from './base-entity';
import { EmployeePermission } from './employeepermission.model';

export class EmployeeModel extends BaseEntity {
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
    pay: string;
    employeeTypeId:number;
    employeeTypeName:string;
    statusId: number;
    statusName: string;
    overTimeRate: string;
    joiningDate:string;
    employeepermissions: EmployeePermission[];

}