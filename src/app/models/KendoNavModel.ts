export class KendoNavModel  {
    id: number;
    Text: string;
    //ParentOrganizationId:number;
    items: KendoNavModel[];
    childrenCount:number;
    checkType: number;
  }