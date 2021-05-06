import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllocationTypeModel } from 'src/app/models/Market/allocation.model';
import { CogsTypeModel } from 'src/app/models/Market/cogs.model';
import { MarketMasterModel } from 'src/app/models/Market/market-master.model';
import { OtherTypeModel } from 'src/app/models/Market/other.model';
import { HttpGenericCrudService } from 'src/app/shared/http-generic-crud.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreateMarketService extends HttpGenericCrudService<MarketMasterModel> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.API_URL, '');
  }

  protected setHeader() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return httpOptions;
  }

  getAllAllocationTypes() {
    return this.httpClient.get<AllocationTypeModel[]>(
      'MarketMaster/listallorganizations'
    );
  }

  getAllCogsType(): Observable<CogsTypeModel[]> {
    return this.httpClient.get<CogsTypeModel[]>(`MarketMaster/GetMarketAllocationModelListByOrgId}`);
  }

  getAllOtherTypes(): Observable<OtherTypeModel[]> {
    return this.httpClient.get<OtherTypeModel[]>(`MarketMaster/GetMarketAllocationModelListByOrgId}`);
  }

  createMarketMaster(data) {
    return this.httpClient.post('MarketMaster', data);
  }
  
}
