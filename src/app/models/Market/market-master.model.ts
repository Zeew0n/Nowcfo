import { MarketAllocationModel } from "./market-allocation.model";

export class MarketMasterModel {
    id:number;
    organizationId:string;
    payPeriod:string;
    allocationTypeId:string;
    allocationName:string;
    marketAllocations:MarketAllocationModel[]
}
