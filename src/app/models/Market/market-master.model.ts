import { MarketAllocation } from "./market-allocation.model";

export class MarketMaster {
    Id:number;
    organizationId:string;
    payPeriod:Date;
    allocationTypeId:string;
    allocationName:string;
    MarketAllocations:MarketAllocation[]
}
