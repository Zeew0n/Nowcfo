import { MarketAllocation } from "./market-allocation.model";

export class MarketMaster {
    Id:string;
    OrganizationId:string;
    PayPeriod:Date;
    AllocationTypeId:string;
    MarketAllocations:MarketAllocation[]
}
