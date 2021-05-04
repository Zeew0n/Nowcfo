import { MarketMaster } from "./market-master.model";

export class MarketAllocation {
        Id:string ;
        MarketId:string;
        MasterId:string;
        Revenue:number;
        COGS:number;
        CogsTypeId:string;
        SE:number;
        EE:number;
        GA:number;
        Other:string;
        OtherTypeId:string ;
        MarketMaster:MarketMaster; 
}
