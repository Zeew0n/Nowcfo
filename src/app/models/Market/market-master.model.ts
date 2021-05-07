import { MarketAllocationModel } from "./market-allocation.model";

export class MarketMasterModel {
    id:number;
    organizationId:string;
    payPeriod:Date;
    allocationTypeId:string;
    allocationName:string;
    marketAllocations:MarketAllocationModel[]
}
